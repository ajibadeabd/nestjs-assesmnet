import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './dbPool';
import { SubscriptionDto, UsageDetails } from '../plan/types';

@Injectable()
export class BillingDataFactory {
  constructor(private readonly databaseService: DatabaseService) {}
  async saveBilling(
    userId: string,
    billingDate: Date,
    totalAmount: number,
    paymentStatus: string,
  ): Promise<any> {
    const query = `
    INSERT INTO billing_history (user_id, billing_date, total_amount, payment_status)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;

    const values = [userId, billingDate, totalAmount, paymentStatus];

    try {
      const response = await this.databaseService.query(query, values);
      return response.rows[0].id;
    } catch (error) {
      throw error;
    }
  }
}
