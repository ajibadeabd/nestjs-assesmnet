import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UsageDataFactory } from '../databaseFactory/usage.factory';
import { spawn, Thread, Worker } from 'threads';

@Controller()
export class BrokerController {
  constructor(private readonly usageDataFactory: UsageDataFactory) {}

  @EventPattern('calculate_billing')
  async handleTicketProcessing(@Payload() data) {
    return new Promise(async (resolve) => {
      const worker = await spawn(new Worker('./billing.worker.js'));
      const response = await worker.getBillingDetails(JSON.parse(data));

      const { status } = await worker.debitUser({
        currency: response.currency,
        amount: response.amount,
        email: response.email,
        planId: response.planId,
        userId: response.userId,
        payment_frequency: response.payment_frequency,
      });
      if (status) {
        await worker.updateFormalUsage(response.userId);
      }
      await Thread.terminate(worker);
      resolve(response);
    });
  }
}
