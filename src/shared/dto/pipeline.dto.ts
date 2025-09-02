import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class EnrichRequestDto {
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  geo?: string;
}

export class GenerateArticleDto {
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  originalLanguage?: string;

  @IsOptional()
  @IsBoolean()
  needTranslation?: boolean;

  @IsOptional()
  @IsString()
  translationLanguage?: string;
}

export class ReviseArticleDto {
  @IsString()
  revisionsRequest: string;

  @IsOptional()
  @IsString()
  targetLanguage?: 'original' | 'translated';
}

export interface PipelineStatusResponse {
  country: string | null;
  skeletonKey: string | null;
  hasEnrichedSkeleton: boolean;
  hasOriginalArticle: boolean;
  hasTranslatedArticle: boolean;
}

export interface EnrichResponseDto {
  enrichedSkeleton: string;
  success: boolean;
}

export interface GenerateArticleResponseDto {
  originalArticle: string;
  translatedArticle?: string;
  success: boolean;
}

export interface ReviseArticleResponseDto {
  revisedArticle: string;
  success: boolean;
}
