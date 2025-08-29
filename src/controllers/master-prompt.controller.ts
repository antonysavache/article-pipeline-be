import { Controller, Get } from '@nestjs/common';
import { MasterPromptUseCase } from '../shared/master-prompt/master-prompt.use-case';

@Controller('master-prompt')
export class MasterPromptController {
  constructor(private readonly masterPromptUseCase: MasterPromptUseCase) {}

  @Get()
  async getMasterPrompt() {
    try {
      await this.masterPromptUseCase.processMasterPromptRequest();
      return {
        success: true,
        message: 'Master prompt has been set successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
