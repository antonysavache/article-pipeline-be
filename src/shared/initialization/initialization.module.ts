import { Module } from '@nestjs/common';
import { InitializationService } from './initialization.service';
import { PipelineConfigService } from '../pipeline/pipeline-config.service';
import { KeywordDiscoveryModule } from '../../modules/keyword-discovery/keyword-discovery.module';
import { ArticleWriterModule } from '../../modules/article-writer/article-writer.module';
import { CountryInfoUseCase } from '../utils/country-info/country-info.use-case';
import { SkeletonUseCase } from '../utils/skeleton/skeleton.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryInfo } from '../../entities/country-info.entity';
import { Skeleton } from '../utils/skeleton/skeleton.entity';
import { GeminiService } from '../gemini/gemini.service';

@Module({
  imports: [
    KeywordDiscoveryModule,
    ArticleWriterModule,
    TypeOrmModule.forFeature([CountryInfo, Skeleton]),
  ],
  providers: [
    InitializationService,
    PipelineConfigService,
    CountryInfoUseCase,
    SkeletonUseCase,
    GeminiService,
  ],
  exports: [InitializationService],
})
export class InitializationModule {}
