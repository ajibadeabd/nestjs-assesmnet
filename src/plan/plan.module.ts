import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../databaseFactory/database.module';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';
import { BrokerModule } from '../message-broker/message.module';
import { PaymentModule } from '../payment/payment.module';
import { PaymentDetailsModule } from '../paymentDetails/payment.details.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PaymentModule,
    BrokerModule,
    DatabaseModule,
    UserModule,
    PaymentDetailsModule,
  ],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlanModule {}
