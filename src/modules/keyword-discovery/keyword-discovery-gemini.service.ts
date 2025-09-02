import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../../shared/gemini/gemini.service';
import { PipelineConfigService } from '../../shared/pipeline/pipeline-config.service';
import { KeywordDiscoveryOptions } from './interfaces/keyword-discovery.interface';
import {KEYWORD_DISCOVERY_PROMPT} from "../../shared/key-word-discovery.prompt";

@Injectable()
export class KeywordDiscoveryGeminiService {
  private readonly logger = new Logger(KeywordDiscoveryGeminiService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly pipelineConfigService: PipelineConfigService,
  ) {}

  /**
   * Выполняет keyword discovery и записывает обогащенный skeleton в pipeline
   */
  async discoverKeywords(options: KeywordDiscoveryOptions): Promise<void> {
    try {
      this.logger.log('Starting keyword discovery with Gemini', { topic: options.topic });

      // Получаем данные из pipeline
      const countryInfo = this.pipelineConfigService.getCountryInfo();
      const skeleton = this.pipelineConfigService.getSkeleton();
      const country = this.pipelineConfigService.getCountry();

      if (!countryInfo || !skeleton) {
        throw new Error('CountryInfo and skeleton must be set in pipeline first');
      }

      // Формируем запрос для Gemini
      const request = {
        mode: 'KeywordDiscovery',
        topic: options.topic,
        geo: options.geo || country || 'US',
        language: options.language || 'en',
        skeleton: skeleton,
        countryInfo: countryInfo,
        discoveryLimits: {
          primary_max: 3,
          secondary_max: 20,
          longTail_max: 80
        }
      };

      this.logger.log('Sending request to Gemini');

      // Отправляем запрос к Gemini
      const response = await this.geminiService.chatWithMultiplePrompts({
        modulePrompt: KEYWORD_DISCOVERY_PROMPT,
        userTask: JSON.stringify(request, null, 2),
      }, {
        model: 'gemini-1.5-flash',
        temperature: 0.1,
        maxTokens: 8000,
      });

      // Просто сохраняем ответ от Gemini как есть в pipeline
      this.pipelineConfigService.setEnrichedSkeleton(response.content);

      console.log(this.pipelineConfigService.getEnrichedSkeleton())

      this.logger.log('Gemini response saved to pipeline as enriched skeleton');
      this.logger.log('Response preview:', response.content.substring(0, 200));

    } catch (error) {
      this.logger.error('Error during keyword discovery with Gemini', error);
      throw error;
    }
  }
}
