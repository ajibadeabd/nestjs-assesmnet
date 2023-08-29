import { Injectable } from '@nestjs/common';
import { encrypt } from '../util';
import { DatabaseService } from './dbPool';

@Injectable()
export class PaymentDetailsFactory {
  constructor(private readonly databaseService: DatabaseService) {}
  async savePaymentAuthCode(userId: string, authCode: string): Promise<void> {
    const findQuery = `
   SELECT   user_id, auth_code
   FROM payment_details
   WHERE payment_details.user_id = $1
  `;
    const query = `
    INSERT INTO payment_details (user_id, auth_code, payment_date)
    VALUES ($1, $2, NOW());
  `;
    const secretKey = process.env.AUTHCODE_SECRET_KEY || 'your-secret-key-here';

    const values = [userId, encrypt(authCode, secretKey)];
    try {
      const response = await this.databaseService.query(findQuery, [userId]);
      console.log(response.rows[0]);
      if (response.rows[0]) {
        return;
      }
      await this.databaseService.query(query, values);
    } catch (error) {
      throw error;
    }
  }
}
