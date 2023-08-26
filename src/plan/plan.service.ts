import { HttpException, Injectable } from '@nestjs/common';
import { IUser } from '../user/type';
import { PlanDataFactory } from '../databaseFactory/plan.factory';
import { v4 as uniqueId } from 'uuid';
import { calculateRenewalAndExpiration } from '../util';
import { UserService } from '../user/user.service';

@Injectable()
export class PlansService {
  constructor(
    private readonly planDataFactory: PlanDataFactory,
    private readonly userService: UserService,
  ) {}

  async getAvailablePlans() {
    return this.getPlans();
  }

  async billUser(userId: string) {
    const s = await this.userService.getUserWithPlan({ id: userId });
    console.log(s);
  }
  async createPlan(planId: number, user: IUser) {
    try {
      const chosenPlan = this.getPlans().find((plan) => {
        return plan.id === String(planId);
      });
      if (!chosenPlan) throw new HttpException('Invalid plan selection', 404);
      delete chosenPlan.id;

      const { renewalDate, expirationDate } = calculateRenewalAndExpiration(
        chosenPlan.payment_frequency,
        new Date(),
      );
      const newPlan = {
        ...chosenPlan,
        billing_cycle: chosenPlan.payment_frequency,
        renewal_date: renewalDate,
        expiration_date: expirationDate,
        user_id: user.id,
        cancellation_policy: 'Cancel anytime with no refunds.',
        updated_at: new Date(),
        id: uniqueId(),
      };
      return await this.planDataFactory.createPlan(newPlan);
    } catch (error) {
      if (error.code == 23505) {
        throw new HttpException('You already have an existing', 400);
      }
      throw new HttpException(
        error.message || 'error occur while creating plan',
        error.status || 400,
      );
    }
  }
  private getPlans() {
    return [
      {
        id: '1',
        name: 'Basic Plan',
        description: 'Standard features with limited usage',
        price: 9.99,
        subscription_tier: 'Basic',
        usage_limits: {
          storage: { limit: 500, overageRate: 0.1 },
          api_calls: { limit: 1000, overageRate: 0.05 },
        },
        currency: 'USD',
        payment_frequency: 'Monthly',
      },
      {
        id: '2',
        name: 'Pro Plan',
        description: 'Advanced features with higher usage limits',
        price: 19.99,
        subscription_tier: 'Pro',
        usage_limits: {
          storage: { limit: 1000, overageRate: 0.05 },
          api_calls: { limit: 5000, overageRate: 0.03 },
        },
        currency: 'USD',
        payment_frequency: 'Monthly',
      },
      {
        id: '3',
        name: 'Premium Plan',
        description: 'Unlimited access to all features and usage',
        price: 49.99,
        subscription_tier: 'Premium',
        usage_limits: {},
        currency: 'USD',
        payment_frequency: 'Monthly',
      },
    ];
  }
}
