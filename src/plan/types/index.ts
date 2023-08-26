import { IsInt, Min, IsUUID } from 'class-validator';

export class PlanIdValidation {
  @IsInt({ message: 'Plan ID must be an integer' })
  @Min(1, { message: 'Plan ID must be greater than or equal to 1' })
  planId: number;
}

export class UserIdValidation {
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId: string;
}

export class PlanDto {
  id: string;
  name: string;
  description: string;
  price: number;
  subscription_tier: string;
  usage_limits: {
    storage?: { limit: number; overageRate: number };
    api_calls?: { limit: number; overageRate: number };
  };
  currency: string;
  payment_frequency: string;
}
