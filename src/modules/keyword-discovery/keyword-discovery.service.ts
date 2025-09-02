import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../../shared/openai/openai.service';
import { PipelineConfigService } from '../../shared/pipeline/pipeline-config.service';
import {KEYWORD_DISCOVERY_PROMPT} from "../../shared/key-word-discovery.prompt";

export interface KeywordDiscoveryOptions {
  topic: string;
  geo?: string;
  language?: string;
}

@Injectable()
export class KeywordDiscoveryService {
  private readonly logger = new Logger(KeywordDiscoveryService.name);

  constructor(
    private readonly openAIService: OpenAIService,
    private readonly pipelineConfigService: PipelineConfigService,
  ) {}

  /**
   * Выполняет keyword discovery и записывает обогащенный skeleton в pipeline
   */
  async discoverKeywords(options: KeywordDiscoveryOptions): Promise<void> {
    try {
      this.logger.log('Starting keyword discovery', { topic: options.topic });

      // Получаем данные из pipeline
      const countryInfo = this.pipelineConfigService.getCountryInfo();
      const skeleton = this.pipelineConfigService.getSkeleton();
      const country = this.pipelineConfigService.getCountry();

      if (!countryInfo || !skeleton) {
        throw new Error('CountryInfo and skeleton must be set in pipeline first');
      }

      // Формируем запрос для OpenAI
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

      this.logger.log('Sending request to OpenAI');

      // Отправляем запрос к OpenAI
      const response = await this.openAIService.chatWithMultiplePrompts({
        modulePrompt: KEYWORD_DISCOVERY_PROMPT,
        userTask: JSON.stringify(request, null, 2),
      }, {
        model: 'gpt-4o-mini',
        temperature: 0.3,
        maxTokens: 4000,
      });

      // Парсим ответ и извлекаем skeleton
      const result = this.parseResponse(response.content);
      const enrichedSkeletonString = JSON.stringify(result.skeleton, null, 2);

      // Записываем в pipeline
      this.pipelineConfigService.setEnrichedSkeleton(enrichedSkeletonString);

      this.logger.log('Keyword discovery completed, enriched skeleton saved to pipeline');

    } catch (error) {
      this.logger.error('Error during keyword discovery', error);
      throw error;
    }
  }

  private parseResponse(responseContent: string): any {
    try {
      const cleanedContent = responseContent
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleanedContent);

      if (!parsed.skeleton) {
        throw new Error('No skeleton in OpenAI response');
      }

      return parsed;
    } catch (error) {
      this.logger.error('Error parsing OpenAI response', error);
      throw new Error('Failed to parse OpenAI response');
    }
  }
}
