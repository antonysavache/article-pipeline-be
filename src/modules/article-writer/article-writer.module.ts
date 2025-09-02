import { Module } from '@nestjs/common';
import { ArticleWriterService } from './article-writer.service';
import { PipelineConfigService } from '../../shared/pipeline/pipeline-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ArticleWriterService, PipelineConfigService],
  exports: [ArticleWriterService],
})
export class ArticleWriterModule {}
