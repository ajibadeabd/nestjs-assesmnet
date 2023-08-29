import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../databaseFactory/database.module';
import { PaymentService } from './payment.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, DatabaseModule, UserModule],
  controllers: [],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
