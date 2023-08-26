import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlanModule } from './plan/plan.module';
// import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    PlanModule,
    // , UserModule, PlanModule
  ],
})
export class AppModule {}
