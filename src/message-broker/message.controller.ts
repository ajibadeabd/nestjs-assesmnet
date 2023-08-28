import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { calculateBillingAmount } from 'bill_amount';

@Controller()
export class BrokerController {
  constructor() {}

  @EventPattern('calculate_billing')
  async handleTicketProcessing(@Payload() data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = this.getBillingDetails(JSON.parse(data));
        console.log(response);
        resolve(response);
      }, 10000);
    });
  }

  private getBillingDetails(subscriptionResponse) {
    const subscriptionPlan = {
      price: subscriptionResponse.price,
      id: subscriptionResponse.id,
      usage_limits: subscriptionResponse.usage_limits,
      currency: subscriptionResponse.currency,
      payment_frequency: subscriptionResponse.billing_cycle,
    };

    const usageData =
      subscriptionResponse.latest_usage_history[0].usage_details;
    return calculateBillingAmount({
      subscriptionPlan,
      usageData,
    });
  }
}
