import { Injectable } from '@nestjs/common';
import { PaymentDetailsFactory } from '../databaseFactory/payment.details.factory';

@Injectable()
export class PaymentDetailsService {
  constructor(private readonly paymentDetailsFactory: PaymentDetailsFactory) {}

  async savePaymentAuthCode(userId: string, authCode: string): Promise<void> {
    return this.paymentDetailsFactory.savePaymentAuthCode(userId, authCode);
  }
}
