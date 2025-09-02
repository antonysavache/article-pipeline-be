import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {PipelineConfigService} from '../pipeline/pipeline-config.service';
import {KeywordDiscoveryGeminiService} from '../../modules/keyword-discovery/keyword-discovery-gemini.service';
import {ArticleWriterService} from '../../modules/article-writer/article-writer.service';
import {CountryInfoUseCase} from '../utils/country-info/country-info.use-case';
import {SkeletonUseCase} from '../utils/skeleton/skeleton.use-case';

@Injectable()
export class InitializationService implements OnApplicationBootstrap {
    private readonly logger = new Logger(InitializationService.name);

    constructor(
        private readonly pipelineConfigService: PipelineConfigService,
        private readonly keywordDiscoveryGeminiService: KeywordDiscoveryGeminiService,
        private readonly articleWriterService: ArticleWriterService,
        private readonly countryInfoUseCase: CountryInfoUseCase,
        private readonly skeletonUseCase: SkeletonUseCase,
    ) {
    }

    async onApplicationBootstrap(): Promise<void> {

    }

    private async initializeCountryInfo(): Promise<void> {
        try {
            this.logger.log('Initializing country info...');

            // Используем use case напрямую
            await this.countryInfoUseCase.processCountryRequest('UK');

            this.logger.log('Country info initialized successfully');

        } catch (error) {
            this.logger.error('Error initializing country info', error);

            // Fallback - устанавливаем базовую информацию
            this.pipelineConfigService.setCountryInfo({
                country: 'UK',
                countryInfo: JSON.stringify({
                    regulators: ['FCA', 'HMRC'],
                    banks: ['Barclays', 'HSBC', 'Lloyds', 'NatWest'],
                    paymentRails: ['faster payments', 'SEPA'],
                    localBankExamples: ['Revolut', 'Monzo'],
                    localTerms: ['sort code', 'account number']
                })
            });

            this.logger.log('Used fallback country info');
        }
    }

    private async initializeSkeleton(): Promise<void> {
        try {
            this.logger.log('Initializing skeleton...');

            // Используем use case напрямую с правильным ключом
            await this.skeletonUseCase.setSkeletonByKey('exchange review');

            this.logger.log('Skeleton initialized successfully');

        } catch (error) {
            this.logger.error('Error initializing skeleton', error);

            // Fallback - устанавливаем базовый skeleton
            const defaultSkeleton = [
                {block_id: 'intro', title: 'Introduction', mappedKeywords: []},
                {block_id: 'overview', title: 'Overview', mappedKeywords: []},
                {block_id: 'features', title: 'Key Features', mappedKeywords: []},
                {block_id: 'howto', title: 'How to Use', mappedKeywords: []},
                {block_id: 'pros-cons', title: 'Pros and Cons', mappedKeywords: []},
                {block_id: 'faq', title: 'FAQ', mappedKeywords: []},
                {block_id: 'conclusion', title: 'Conclusion', mappedKeywords: []}
            ];

            this.pipelineConfigService.setSkeleton(JSON.stringify(defaultSkeleton, null, 2));

            this.logger.log('Used fallback skeleton');
        }
    }

    private async runKeywordDiscovery(): Promise<void> {
        try {
            this.logger.log('Running keyword discovery with Gemini...');

            await this.keywordDiscoveryGeminiService.discoverKeywords({
                topic: 'Binance UK 2025', // можно сделать конфигурируемым
                geo: 'UK',
                language: 'en'
            });

            this.logger.log('Keyword discovery with Gemini completed successfully');

        } catch (error) {
            this.logger.error('Error running keyword discovery with Gemini', error);
        }
    }

    private async writeArticle(): Promise<void> {
        try {
            this.logger.log('Writing article with Gemini...');

            const article = await this.articleWriterService.writeArticle({
                topic: 'Binance UK  2025',
                additionalInstructions: 'Focus on UK market specifics and regulations'
            });

            this.logger.log('Article writing completed successfully');
            this.logger.log(`Article length: ${article.length} characters`);

            console.log(article)

        } catch (error) {
            this.logger.error('Error writing article with Gemini', error);
        }
    }
}
