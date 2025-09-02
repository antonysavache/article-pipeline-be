import { Module } from '@nestjs/common';
import { KeywordDiscoveryService } from './keyword-discovery.service';
import { KeywordDiscoveryGeminiService } from './keyword-discovery-gemini.service';
import { OpenAIService } from '../../shared/openai/openai.service';
import { GeminiService } from '../../shared/gemini/gemini.service';
import { PipelineConfigService } from '../../shared/pipeline/pipeline-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    KeywordDiscoveryService,
    KeywordDiscoveryGeminiService,
    OpenAIService,
    GeminiService,
    PipelineConfigService
  ],
  exports: [KeywordDiscoveryService, KeywordDiscoveryGeminiService],
})
export class KeywordDiscoveryModule {}
