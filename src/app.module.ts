import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { CountryInfo } from './entities/country-info.entity';
import { MasterPrompts } from './entities/master-prompts.entity';
import { CountryController } from './controllers/country.controller';
import { MasterPromptController } from './controllers/master-prompt.controller';
import { CountryInfoUseCase } from './modules/country-info/country-info.use-case';
import { PipelineConfigService } from './shared/pipeline/pipeline-config.service';
import { OpenAIService } from './shared/openai/openai.service';
import { MasterPromptUseCase } from './shared/master-prompt/master-prompt.use-case';

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
    TypeOrmModule.forFeature([CountryInfo, MasterPrompts]),
  ],
  controllers: [
    AppController,
    CountryController,
    MasterPromptController,
  ],
  providers: [
    AppService,
    DatabaseService,
    CountryInfoUseCase,
    MasterPromptUseCase,
    PipelineConfigService,
    OpenAIService,
  ],
})
export class AppModule {}
