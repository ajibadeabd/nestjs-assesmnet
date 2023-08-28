import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../databaseFactory/database.module';
// import { UserController } from './user.controllera';
import { UserService } from './user.service';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
