import { HttpException, Injectable } from '@nestjs/common';
import { IUser } from '../user/type';
import { PlanDataFactory } from '../databaseFactory/plan.factory';
import { calculateRenewalAndExpiration } from '../util';
import { UserService } from '../user/user.service';
import { BrokerService } from '../message-broker/message.service';
import { PaymentService } from '../payment/payment.service';
import { UsageDataFactory } from '../databaseFactory/usage.factory';
import { PaymentDetailsService } from '../paymentDetails/payment.details.service';

@Injectable()
export class PlansService {
  constructor(
    private readonly planDataFactory: PlanDataFactory,
    private readonly userService: UserService,
    private readonly brokerService: BrokerService,
    private readonly usageDataFactory: UsageDataFactory,
    private readonly paymentService: PaymentService,
    private readonly paymentDetailsService: PaymentDetailsService,
  ) {}

  async getAvailablePlans() {
    return this.planDataFactory.getPlans();
  }

  async billUser(userId: string) {
    const subscriptionResponse =
      await this.userService.getUserSubscriptionWithPlan({
        userId,
      });

    this.brokerService.processBilling(subscriptionResponse);

    console.log('done');
    return;
  }

  async createSubscription({ data, event }) {
    if (event !== 'charge.success') {
      console.log('notify users that their payment failed');
      return;
    }

    const { id } = await this.userService.updateUserDetails(
      data.metadata.planId,
      data.customer.email,
    );
    await this.createSubscriptionUsageAndBilling(
      id,
      data.metadata.billingCycle,
    );
    await this.paymentDetailsService.savePaymentAuthCode(
      id,
      data.authorization.authorization_code,
    );
  }

  async createSubscriptionUsageAndBilling(
    userId: string,
    billingCycle: string,
  ) {
    const { startDate, expirationDate } = calculateRenewalAndExpiration(
      billingCycle,
      new Date(),
    );
    return this.usageDataFactory.createPlanUsageAndBilling(
      userId,
      startDate,
      expirationDate,
    );
  }
  async initializePayment(planId: string, user: IUser) {
    if (user.plan_id) {
      throw new HttpException(
        'You are already subscribed to a plan. You cannot subscribe again.',
        400,
      );
    }
    const plan = await this.planDataFactory.getPlan(planId);

    if (!plan) {
      throw new HttpException('Plan does not exist', 400);
    }
    try {
      const paymentResponse = await this.paymentService.post(
        process.env.PAYSTACK_BASE_URL + '/transaction/initialize',
        { authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY },
        {
          email: user.email,
          amount: +plan.price,
          planId,
          currency: plan.currency,
          metadata: { planId, billingCycle: plan.payment_frequency },
        },
      );
      return paymentResponse.data;
    } catch (error) {
      throw error;
    }
  }
}
