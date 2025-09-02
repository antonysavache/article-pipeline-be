import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineConfigService } from '../../pipeline/pipeline-config.service';
import { Skeleton } from './skeleton.entity';

@Injectable()
export class SkeletonUseCase {
  constructor(
    @InjectRepository(Skeleton)
    private readonly skeletonRepository: Repository<Skeleton>,
    private readonly pipelineConfigService: PipelineConfigService,
  ) {}

  async setSkeletonByKey(key: string): Promise<void> {
    const skeleton = await this.skeletonRepository.findOne({
      where: { key },
    });

    if (!skeleton) {
      throw new NotFoundException(`Skeleton with key "${key}" not found`);
    }

    this.pipelineConfigService.setSkeleton(skeleton.skeleton);
    this.pipelineConfigService.setCurrentSkeletonKey(key);
  }

  async getAvailableSkeletons(): Promise<Array<{ key: string }>> {
    const skeletons = await this.skeletonRepository.find({
      select: ['key'],
    });

    return skeletons.map(skeleton => ({
      key: skeleton.key,
    }));
  }
}
