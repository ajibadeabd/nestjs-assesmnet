import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'; // Import swagger annotations
import { HttpResponse } from '../util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlansService } from './subscription.service';
import { PlanIdValidation, UserIdValidation } from './types';

@ApiTags('plans') // Tag the controller with 'plans' for Swagger documentation
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' }) // Add Swagger response annotation
  @Get()
  async getPlans(@Res() response) {
    const result = await this.plansService.getAvailablePlans();
    return HttpResponse.ok(response, result, 'Plans retrieved successfully');
  }

  @ApiResponse({ status: 201, description: 'User billed successfully' }) // Add Swagger response annotation
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('bill')
  async billUser(@Body() userData: UserIdValidation, @Res() response) {
    await this.plansService.billUser(userData.userId);
    return HttpResponse.created(response, null, 'User billed successfully');
  }

  @ApiResponse({ status: 201, description: 'Plan created successfully' }) // Add Swagger response annotation
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createSubscription(
    @Body() planIdValidation: PlanIdValidation,
    @Req() request,
    @Res() response,
  ) {
    const planId = planIdValidation.planId;

    const result = await this.plansService.createSubscription(
      planId,
      request.user,
    );
    return HttpResponse.created(response, result, 'Plan created successfully');
  }
}
