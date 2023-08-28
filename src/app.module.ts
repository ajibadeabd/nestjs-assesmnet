import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BrokerModule } from './message-broker/message.module';
import { PlanModule } from './subscription/subscription.module';
// import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    PlanModule,
    BrokerModule,
    // , UserModule, PlanModule
  ],
})
export class AppModule {}
