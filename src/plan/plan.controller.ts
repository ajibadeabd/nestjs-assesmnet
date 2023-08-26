import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { HttpResponse } from '../util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlansService } from './plan.service';
import { PlanIdValidation, UserIdValidation } from './types';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async getPlans() {
    return this.plansService.getAvailablePlans();
  }

  @Post('bill')
  @UseGuards(JwtAuthGuard)
  async billUser(@Body() userData: UserIdValidation) {
    return this.plansService.billUser(userData.userId);
  }
  @Post(':planId')
  @UseGuards(JwtAuthGuard)
  async createPlan(
    @Param() planIdValidation: PlanIdValidation,
    @Req() request,
    @Res() response,
  ) {
    const planId = planIdValidation.planId;

    const result = await this.plansService.createPlan(planId, request.user);
    return HttpResponse.created(response, result, 'Plan created successfully');
  }
}
