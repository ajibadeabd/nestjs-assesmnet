import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './dbPool';
import { UserDataFactory } from './user.factory';
import { SubscriptionDataFactory } from './subscription.factory';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [DatabaseService, UserDataFactory, SubscriptionDataFactory],
  exports: [DatabaseService, UserDataFactory, SubscriptionDataFactory],
})
export class DatabaseModule {}
