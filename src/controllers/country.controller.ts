import { Controller, Get, Param } from '@nestjs/common';
import { CountryInfoUseCase } from '../modules/country-info/country-info.use-case';

@Controller('country')
export class CountryController {
  constructor(private readonly countryInfoUseCase: CountryInfoUseCase) {}

  @Get(':countryKey')
  async setCountryInfo(@Param('countryKey') countryKey: string) {
    try {
      await this.countryInfoUseCase.processCountryRequest(countryKey);
      return {
        success: true,
        message: `Country info for "${countryKey}" has been set successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
