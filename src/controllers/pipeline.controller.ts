import { Controller, Get, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { PipelineConfigService } from '../shared/pipeline/pipeline-config.service';
import { KeywordDiscoveryGeminiService } from '../modules/keyword-discovery/keyword-discovery-gemini.service';
import { GeminiService } from '../shared/gemini/gemini.service';
import { 
  EnrichRequestDto, 
  GenerateArticleDto, 
  ReviseArticleDto,
  PipelineStatusResponse,
  EnrichResponseDto,
  GenerateArticleResponseDto,
  ReviseArticleResponseDto
} from '../shared/dto/pipeline.dto';
import { ARTICLE_WRITER_PROMPT } from '../shared/article-writer.prompt';

@Controller('pipeline')
export class PipelineController {
  constructor(
    private readonly pipelineConfigService: PipelineConfigService,
    private readonly keywordDiscoveryService: KeywordDiscoveryGeminiService,
    private readonly geminiService: GeminiService,
  ) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getPipelineStatus(): Promise<PipelineStatusResponse> {
    return this.pipelineConfigService.getStatusForFrontend();
  }

  @Post('enrich')
  @HttpCode(HttpStatus.OK)
  async enrichSkeleton(@Body() dto: EnrichRequestDto): Promise<EnrichResponseDto> {
    try {
      // Проверяем что у нас есть необходимые данные
      const country = this.pipelineConfigService.getCountry();
      const skeleton = this.pipelineConfigService.getSkeleton();

      if (!country || !skeleton) {
        throw new BadRequestException('Country and skeleton must be set before enriching');
      }

      // Используем существующий сервис для обогащения
      await this.keywordDiscoveryService.discoverKeywords({
        topic: dto.topic,
        language: dto.language || 'en',
        geo: dto.geo || country,
      });

      const enrichedSkeleton = this.pipelineConfigService.getEnrichedSkeleton();

      return {
        enrichedSkeleton,
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateArticle(@Body() dto: GenerateArticleDto): Promise<GenerateArticleResponseDto> {
    try {
      const enrichedSkeleton = this.pipelineConfigService.getEnrichedSkeleton();
      
      if (!enrichedSkeleton) {
        throw new BadRequestException('Enriched skeleton must be created before generating article');
      }

      // Генерируем оригинальную статью
      const originalArticleRequest = {
        mode: 'ArticleGeneration',
        topic: dto.topic,
        language: dto.originalLanguage || 'en',
        enrichedSkeleton: enrichedSkeleton,
        countryInfo: this.pipelineConfigService.getCountryInfo(),
      };

      const originalResponse = await this.geminiService.chatWithMultiplePrompts({
        modulePrompt: ARTICLE_WRITER_PROMPT,
        userTask: JSON.stringify(originalArticleRequest, null, 2),
      }, {
        model: 'gemini-1.5-flash',
        temperature: 0.3,
        maxTokens: 8000,
      });

      // Сохраняем оригинальную статью
      this.pipelineConfigService.setOriginalArticle(originalResponse.content);

      const result: GenerateArticleResponseDto = {
        originalArticle: originalResponse.content,
        success: true,
      };

      // Если нужен перевод
      if (dto.needTranslation) {
        const translationRequest = `Переведи следующую статью на ${dto.translationLanguage || 'русский'} язык, сохраняя структуру и стиль:\n\n${originalResponse.content}`;

        const translationResponse = await this.geminiService.chatWithMultiplePrompts({
          modulePrompt: 'Ты профессиональный переводчик. Переводи текст максимально точно, сохраняя стиль и структуру.',
          userTask: translationRequest,
        }, {
          model: 'gemini-1.5-flash',
          temperature: 0.1,
          maxTokens: 8000,
        });

        // Сохраняем переведенную статью
        this.pipelineConfigService.setTranslatedArticle(translationResponse.content);
        result.translatedArticle = translationResponse.content;
      }

      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('revise')
  @HttpCode(HttpStatus.OK)
  async reviseArticle(@Body() dto: ReviseArticleDto): Promise<ReviseArticleResponseDto> {
    try {
      let articleToRevise: string;
      
      if (dto.targetLanguage === 'translated') {
        articleToRevise = this.pipelineConfigService.getTranslatedArticle();
        if (!articleToRevise) {
          throw new BadRequestException('No translated article available for revision');
        }
      } else {
        articleToRevise = this.pipelineConfigService.getOriginalArticle();
        if (!articleToRevise) {
          throw new BadRequestException('No original article available for revision');
        }
      }

      const revisionRequest = `Внеси следующие изменения в статью: "${dto.revisionsRequest}"\n\nОригинальная статья:\n${articleToRevise}`;

      const revisionResponse = await this.geminiService.chatWithMultiplePrompts({
        modulePrompt: 'Ты редактор статей. Внеси запрашиваемые изменения в текст, сохраняя общий стиль и структуру.',
        userTask: revisionRequest,
      }, {
        model: 'gemini-1.5-flash',
        temperature: 0.2,
        maxTokens: 8000,
      });

      // Обновляем соответствующую статью
      if (dto.targetLanguage === 'translated') {
        this.pipelineConfigService.setTranslatedArticle(revisionResponse.content);
      } else {
        this.pipelineConfigService.setOriginalArticle(revisionResponse.content);
      }

      return {
        revisedArticle: revisionResponse.content,
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
