import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './dbPool';
import { UserDataFactory } from './user.factory';
import { PlanDataFactory } from './plan.factory';
import { UsageDataFactory } from './usage.factory';
import { PaymentDetailsFactory } from './payment.details.factory';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [
    DatabaseService,
    UserDataFactory,
    UsageDataFactory,
    PlanDataFactory,
    PaymentDetailsFactory,
  ],
  exports: [
    DatabaseService,
    UserDataFactory,
    PaymentDetailsFactory,
    UsageDataFactory,
    PlanDataFactory,
  ],
})
export class DatabaseModule {}
