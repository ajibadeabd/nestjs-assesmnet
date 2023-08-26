import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './dbPool';
import { UserDataFactory } from './user.factory';
import { PlanDataFactory } from './plan.factory';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [DatabaseService, UserDataFactory, PlanDataFactory],
  exports: [DatabaseService, UserDataFactory, PlanDataFactory],
})
export class DatabaseModule {}
