import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/types';
import { DatabaseService } from '../databaseFactory/dbPool';
import { IUser } from './type';
import { UserDataFactory } from '../databaseFactory/user.factory';

@Injectable()
export class UserService {
  constructor(
    // private databaseService: DatabaseService,
    private userDataFactory: UserDataFactory,
  ) {}

  async getUser(
    queryParameters: { [key: string]: string },
    excludeProperties = false,
  ): Promise<IUser | null> {
    return this.userDataFactory.getUser(queryParameters, excludeProperties);
  }
  async getUserWithPlan(
    queryParameters: { [key: string]: string },
    excludeProperties = false,
  ): Promise<IUser | null> {
    return this.userDataFactory.getUser(
      queryParameters,
      excludeProperties,
      true,
    );
  }

  createUser(createUserDto: CreateUserDto): Promise<IUser> {
    return this.userDataFactory.createUser(createUserDto);
  }
}
