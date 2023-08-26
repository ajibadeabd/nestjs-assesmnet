import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/databaseFactory/dbPool';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, DatabaseService],
})
export class UserModule {}
