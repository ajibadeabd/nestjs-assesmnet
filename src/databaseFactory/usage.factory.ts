import { Injectable } from '@nestjs/common';
import { DatabaseService } from './dbPool';

@Injectable()
export class UsageDataFactory {
  constructor(private readonly databaseService: DatabaseService) {}
  async createPlanUsageAndBilling(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const query = `
    INSERT INTO usage_history (user_id, start_date, end_date, api_usage, storage_usage, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;
    //   const billingQuery = `
    //   INSERT INTO billing_history (user_id, start_date, end_date, api_usage, storage_usage, status)
    //   VALUES ($1, $2, $3, $4, $5, $6)
    //   RETURNING id;
    // `;

    const values = [userId, startDate, endDate, 0, 0, 'active'];

    try {
      const response = await this.databaseService.query(query, values);
      return response.rows[0].id;
    } catch (error) {
      throw error;
    }
  }
}
