import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../databaseFactory/database.module';
import { PaymentDetailsService } from './payment.details.service';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [],
  providers: [PaymentDetailsService],
  exports: [PaymentDetailsService],
})
export class PaymentDetailsModule {}
