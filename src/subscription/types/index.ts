import {
  IsInt,
  Min,
  IsUUID,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

// plan-id-validation.dto.ts
export class PlanIdValidation {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'Plan ID must be an integer' })
  @Min(1, { message: 'Invalid Plan ID' })
  planId: number = 1; // Default plan ID
}

// user-id-validation.dto.ts
export class UserIdValidation {
  @ApiProperty({ example: 'a4ef6b46-9422-4d3d-a3ea-4eaae2ddec4d' }) // Add ApiProperty decorator with example value
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId: string = 'a4ef6b46-9422-4d3d-a3ea-4eaae2ddec4d'; // Default UUID
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

class UsageLimits {
  @IsOptional()
  @IsObject()
  storage?: { limit: number; overageRate: number };

  @IsOptional()
  @IsObject()
  api_calls?: { limit: number; overageRate: number };
}

export class SubscriptionDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  subscription_tier: string;

  @IsObject()
  usage_limits: UsageLimits;

  @IsString()
  currency: string;

  @IsString()
  payment_frequency: string;

  @IsString()
  billing_cycle: string;

  @IsDate()
  renewal_date: string;

  @IsDate()
  expiration_date: Date;

  @IsString()
  user_id: string;

  @IsString()
  cancellation_policy: string;

  @IsDate()
  updated_at: Date;
}

export interface UsageDetails {
  id: string;
  user_id: string;
  subscription_id: string;
  start_date: Date;
  end_date: Date;
  usage_details: {
    storage: {
      used: number;
    };
    api_calls: {
      used: number;
    };
  };
}
