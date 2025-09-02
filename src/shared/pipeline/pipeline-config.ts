interface PipelineConfig {
  country: string;
  countryInfo: string;
  skeleton: string;
  currentSkeletonKey: string;
  enrichedSkeleton: string;
  originalArticle: string;
  translatedArticle: string;
}

export const pipelineConfig: PipelineConfig = {
  country: '',
  countryInfo: '',
  skeleton: '',
  currentSkeletonKey: '',
  enrichedSkeleton: '',
  originalArticle: '',
  translatedArticle: '',
};
