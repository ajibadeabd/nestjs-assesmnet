import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/types';
import { IUser } from './type';
import { UserDataFactory } from '../databaseFactory/user.factory';
import { PlanDataFactory } from '../databaseFactory/plan.factory';

@Injectable()
export class UserService {
  constructor(
    private userDataFactory: UserDataFactory,
    private subscriptionDataFactory: PlanDataFactory,
  ) {}

  async getUser(
    queryParameters: { [key: string]: string },
    excludeProperties = false,
  ): Promise<IUser | null> {
    return this.userDataFactory.getUser(queryParameters, excludeProperties);
  }
  async updateUserDetails(
    planId: string,
    email: string,
  ): Promise<IUser | null> {
    return this.userDataFactory.updateUserDetails(planId, email);
  }

  async getUserSubscriptionWithPlan(queryParameters: {
    [key: string]: string;
  }) {
    const response =
      await this.subscriptionDataFactory.getSubscriptionAndUsage(
        queryParameters,
      );
    return response;
  }

  createUser(createUserDto: CreateUserDto): Promise<IUser> {
    return this.userDataFactory.createUser(createUserDto);
  }
}
