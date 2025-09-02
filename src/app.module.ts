import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database/database.service';
import { CountryInfo } from './entities/country-info.entity';
import { CountryController } from './controllers/country.controller';
import { SkeletonController } from './controllers/skeleton.controller';
import { PipelineController } from './controllers/pipeline.controller';
import { PipelineConfigService } from './shared/pipeline/pipeline-config.service';
import { OpenAIService } from './shared/openai/openai.service';
import { GeminiService } from './shared/gemini/gemini.service';
import { Skeleton } from "./shared/utils/skeleton/skeleton.entity";
import { CountryInfoUseCase } from "./shared/utils/country-info/country-info.use-case";
import { SkeletonUseCase } from "./shared/utils/skeleton/skeleton.use-case";
import { InitializationModule } from './shared/initialization/initialization.module';
import { KeywordDiscoveryGeminiService } from './modules/keyword-discovery/keyword-discovery-gemini.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    TypeOrmModule.forFeature([
      CountryInfo,
      Skeleton,
    ]),
    InitializationModule,
  ],
  controllers: [CountryController, SkeletonController, PipelineController],
  providers: [
    DatabaseService,
    CountryInfoUseCase,
    SkeletonUseCase,
    PipelineConfigService,
    OpenAIService,
    GeminiService,
    KeywordDiscoveryGeminiService,
  ],
})
export class AppModule {}
