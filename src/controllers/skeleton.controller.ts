import { Controller, Post, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { SkeletonUseCase } from '../shared/utils/skeleton/skeleton.use-case';

@Controller('skeleton')
export class SkeletonController {
  constructor(private readonly skeletonUseCase: SkeletonUseCase) {}

  @Get('available')
  async getAvailableSkeletons(): Promise<Array<{ key: string }>> {
    return await this.skeletonUseCase.getAvailableSkeletons();
  }

  @Post(':key/set')
  @HttpCode(HttpStatus.OK)
  async setSkeleton(@Param('key') key: string): Promise<{ message: string }> {
    await this.skeletonUseCase.setSkeletonByKey(key);
    return { message: `Skeleton "${key}" set successfully` };
  }
}
