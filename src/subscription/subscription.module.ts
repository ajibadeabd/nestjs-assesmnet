import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../databaseFactory/database.module';
import { PlansController } from './subscription.controller';
import { PlansService } from './subscription.service';
import { BrokerModule } from '../message-broker/message.module';

@Module({
  imports: [ConfigModule.forRoot(), BrokerModule, DatabaseModule, UserModule],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlanModule {}
