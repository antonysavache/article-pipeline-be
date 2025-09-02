import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryInfo } from '../../../entities/country-info.entity';
import { PipelineConfigService } from '../../pipeline/pipeline-config.service';

@Injectable()
export class CountryInfoUseCase {
  constructor(
    @InjectRepository(CountryInfo)
    private readonly countryInfoRepository: Repository<CountryInfo>,
    private readonly pipelineConfigService: PipelineConfigService,
  ) {}

  async processCountryRequest(countryKey: string): Promise<void> {
    const countryData = await this.countryInfoRepository.findOne({
      where: { key: countryKey },
    });

    if (!countryData) {
      throw new Error(`Country with key "${countryKey}" not found`);
    }

    this.pipelineConfigService.setCountryInfo({
      country: countryKey,
      countryInfo: countryData.info,
    });
  }
}
