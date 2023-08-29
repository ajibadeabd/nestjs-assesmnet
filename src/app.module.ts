import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BrokerModule } from './message-broker/message.module';
import { PlanModule } from './plan/plan.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, PaymentModule, PlanModule, BrokerModule],
})
export class AppModule {}
