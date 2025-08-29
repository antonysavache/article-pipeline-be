import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterPrompts } from '../../entities/master-prompts.entity';
import { PipelineConfigService } from '../../shared/pipeline/pipeline-config.service';

@Injectable()
export class MasterPromptUseCase {
  constructor(
    @InjectRepository(MasterPrompts)
    private readonly masterPromptsRepository: Repository<MasterPrompts>,
    private readonly pipelineConfigService: PipelineConfigService,
  ) {}

  async processMasterPromptRequest(): Promise<void> {
    const masterPromptData = await this.masterPromptsRepository.findOne({
      where: { id: 1 },
    });

    if (!masterPromptData) {
      throw new Error('Master prompt with id = 1 not found');
    }

    console.log('Master prompt from database:', masterPromptData.prompt);

    this.pipelineConfigService.setMasterPrompt(masterPromptData.prompt);
  }
}
