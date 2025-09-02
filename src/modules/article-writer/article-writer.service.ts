import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PipelineConfigService } from '../../shared/pipeline/pipeline-config.service';
import { ArticleWriterOptions } from './interfaces/article-writer.interface';
import {ARTICLE_WRITER_PROMPT} from "../../shared/article-writer.prompt";

@Injectable()
export class ArticleWriterService {
  private readonly logger = new Logger(ArticleWriterService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly pipelineConfigService: PipelineConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    // @ts-ignore
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Пишет статью используя countryInfo и enrichedSkeleton из pipeline
   */
  async writeArticle(options: ArticleWriterOptions = {}): Promise<string> {
    try {
      this.logger.log('Starting article writing with Gemini');

      // Получаем данные из pipeline
      const countryInfo = this.pipelineConfigService.getCountryInfo();
      const enrichedSkeleton = this.pipelineConfigService.getEnrichedSkeleton();

      if (!countryInfo || !enrichedSkeleton) {
        throw new Error('CountryInfo and enrichedSkeleton must be set in pipeline first');
      }

      // Формируем полный промпт: промпт + данные
      const fullPrompt = `${ARTICLE_WRITER_PROMPT}

DATA:
{
  "countryInfo": ${countryInfo},
  "enrichedSkeleton": ${enrichedSkeleton},
  "topic": "${options.topic || 'Binance'}"
}`;

      this.logger.log('Sending article writing request to Gemini');

      // Прямой запрос к Gemini
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const article = response.text();

      this.logger.log('Article written successfully');
      this.logger.log(`Article length: ${article.length} characters`);

      return article;

    } catch (error) {
      this.logger.error('Error during article writing with Gemini', error);
      throw error;
    }
  }
}
