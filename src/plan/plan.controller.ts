import { Controller, Get, Param } from '@nestjs/common';
import { PlansService } from './plan.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get(':id')
  async getPlan(@Param('id') id: string) {
    return this.plansService.getPlan(id);
  }
}

// exports  PlansController