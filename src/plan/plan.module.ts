import { Module } from '@nestjs/common';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';

@Module({
  imports: [],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlanModule {}
