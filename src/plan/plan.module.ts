import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../databaseFactory/database.module';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UserModule],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlanModule {}
