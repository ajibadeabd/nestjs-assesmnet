import { Injectable } from '@nestjs/common';
import { encrypt } from '../util';
import { DatabaseService } from './dbPool';

@Injectable()
export class PaymentDetailsFactory {
  constructor(private readonly databaseService: DatabaseService) {}
  async savePaymentAuthCode(userId: string, authCode: string): Promise<void> {
    const query = `
    INSERT INTO payment_details (user_id, auth_code, payment_date)
    VALUES ($1, $2, NOW());
  `;
    const secretKey = process.env.AUTHCODE_SECRET_KEY || 'your-secret-key-here';

    const values = [userId, encrypt(authCode, secretKey)];
    try {
      await this.databaseService.query(query, values);
    } catch (error) {
      //throw error;
    }
  }
}
