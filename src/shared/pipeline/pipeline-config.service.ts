import { Injectable } from '@nestjs/common';
import { pipelineConfig } from './pipeline-config';
import { SetCountryInfoParams } from './interfaces/pipeline-config.interface';

@Injectable()
export class PipelineConfigService {
  setCountryInfo({ country, countryInfo }: SetCountryInfoParams): void {
    pipelineConfig.country = country;
    pipelineConfig.countryInfo = countryInfo;

    // Выводим весь объект конфига в консоль
    console.log('Pipeline Config after setting country info:', pipelineConfig);
  }

  setMasterPrompt(masterPrompt: string): void {
    pipelineConfig.masterPrompt = masterPrompt;

    // Выводим весь объект конфига в консоль
    console.log('Pipeline Config after setting master prompt:', pipelineConfig);
  }

  getMasterPrompt(): string {
    return pipelineConfig.masterPrompt;
  }

  setArticleConfig(articleConfig: string): void {
    pipelineConfig.articleConfig = articleConfig;

    // Выводим весь объект конфига в консоль
    console.log(
      'Pipeline Config after setting article config:',
      pipelineConfig,
    );
  }
}
