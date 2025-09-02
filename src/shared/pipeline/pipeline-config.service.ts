import { Injectable } from '@nestjs/common';
import { pipelineConfig } from './pipeline-config';
import { SetCountryInfoParams } from './interfaces/pipeline-config.interface';

@Injectable()
export class PipelineConfigService {
  setCountryInfo({ country, countryInfo }: SetCountryInfoParams): void {
    pipelineConfig.country = country;
    pipelineConfig.countryInfo = countryInfo;
  }

  getCountryInfo(): string {
    return pipelineConfig.countryInfo;
  }

  getCountry(): string {
    return pipelineConfig.country;
  }

  setSkeleton(skeleton: string): void {
    pipelineConfig.skeleton = skeleton;
  }

  getSkeleton(): string {
    return pipelineConfig.skeleton;
  }

  setCurrentSkeletonKey(key: string): void {
    pipelineConfig.currentSkeletonKey = key;
  }

  getCurrentSkeletonKey(): string {
    return pipelineConfig.currentSkeletonKey;
  }

  setEnrichedSkeleton(enrichedSkeleton: string): void {
    pipelineConfig.enrichedSkeleton = enrichedSkeleton;
  }

  getEnrichedSkeleton(): string {
    return pipelineConfig.enrichedSkeleton;
  }

  setOriginalArticle(article: string): void {
    pipelineConfig.originalArticle = article;
  }

  getOriginalArticle(): string {
    return pipelineConfig.originalArticle;
  }

  setTranslatedArticle(article: string): void {
    pipelineConfig.translatedArticle = article;
  }

  getTranslatedArticle(): string {
    return pipelineConfig.translatedArticle;
  }

  // Статус для фронтенда
  getStatusForFrontend() {
    return {
      country: pipelineConfig.country,
      skeletonKey: pipelineConfig.currentSkeletonKey,
      hasEnrichedSkeleton: !!pipelineConfig.enrichedSkeleton,
      hasOriginalArticle: !!pipelineConfig.originalArticle,
      hasTranslatedArticle: !!pipelineConfig.translatedArticle,
    };
  }

  // Полезный метод для получения всего состояния pipeline
  getPipelineState() {
    return {
      country: pipelineConfig.country,
      countryInfo: pipelineConfig.countryInfo,
      skeleton: pipelineConfig.skeleton,
      enrichedSkeleton: pipelineConfig.enrichedSkeleton,
      originalArticle: pipelineConfig.originalArticle,
      translatedArticle: pipelineConfig.translatedArticle,
    };
  }
}
