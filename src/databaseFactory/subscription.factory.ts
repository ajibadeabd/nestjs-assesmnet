import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './dbPool';
import { SubscriptionDto, UsageDetails } from '../subscription/types';

@Injectable()
export class SubscriptionDataFactory {
  constructor(private readonly databaseService: DatabaseService) {}

  async getSubscriptionAndUsage(queryParameter): Promise<any> {
    try {
      const query = `
              SELECT subscriptions.id, price,billing_cycle ,expiration_date, currency,usage_limits,
              (
                  SELECT json_agg(usage_history)
                  FROM (
                    SELECT *
                    FROM usage_history
                    WHERE usage_history.subscription_id = subscriptions.id
                    ORDER BY created_at DESC
                    LIMIT 1
                  ) AS latest_usage_history
              ) AS latest_usage_history
              FROM subscriptions
              LEFT JOIN usage_history ON subscriptions.id = usage_history.subscription_id
              WHERE subscriptions.user_id = $1
              GROUP BY subscriptions.id;
              `;
      const response = await this.databaseService.query(query, [
        queryParameter.userId,
      ]);
      if (!response.rows.length) {
        throw new HttpException('Wrong User id', 400);
      }
      return response.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async createSubscriptionAndUsage(
    subscription: SubscriptionDto,
    usageDetails: UsageDetails,
  ): Promise<any> {
    const query = `
      INSERT INTO subscriptions(
        ${Object.keys(subscription).join(', ')}
      )
      VALUES (${Object.keys(subscription)
        .map((_, index) => `$${index + 1}`)
        .join(', ')})
      RETURNING id, name;
    `;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const values = Object.entries(subscription).map(([_, value]) => value);
    try {
      //Begin a transaction
      await this.databaseService.query('BEGIN');
      const subscriptionResponse = await this.databaseService.query(
        query,
        values,
      );

      const usageQuery = `
      INSERT INTO usage_history(
        ${Object.keys(usageDetails).join(', ')}
      )
      VALUES (${Object.keys(usageDetails)
        .map((_, index) => `$${index + 1}`)
        .join(', ')})
      RETURNING id;
    `;
      const usageValues = Object.entries(usageDetails).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value,
      );

      await this.databaseService.query(usageQuery, usageValues);

      await this.databaseService.query('COMMIT'); // Commit the transaction
      return subscriptionResponse.rows[0];
    } catch (error) {
      await this.databaseService.query('ROLLBACK');
      throw error;
    }
  }
}
