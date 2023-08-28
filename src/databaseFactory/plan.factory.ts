import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './dbPool';
import { PlanDto, SubscriptionDto, UsageDetails } from '../plan/types';

@Injectable()
export class PlanDataFactory {
  constructor(private readonly databaseService: DatabaseService) {}
  async getPlans(): Promise<PlanDto[]> {
    const query = `SELECT id, name, description, price, subscription_tier, usage_limits, currency, payment_frequency
FROM plans;
`;

    const response = await this.databaseService.query(query);
    return response.rows;
  }

  async getPlan(planId: string): Promise<PlanDto> {
    const query = `
    SELECT id, name, description, price, subscription_tier, usage_limits, currency, payment_frequency
    FROM plans
    WHERE id = $1;
  `;

    const values = [planId];

    try {
      const response = await this.databaseService.query(query, values);
      return response.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionAndUsage(queryParameter): Promise<any> {
    try {
      const query = `
      SELECT
        users.id AS user_id,
        users.name AS user_name,
        users.email AS user_email,
        plans.id AS plan_id,
        plans.name AS plan_name,
        plans.currency AS currency,
        plans.payment_frequency AS billing_cycle,
        plans.usage_limits AS plan_usage,
        plans.price AS plan_price,
        plans.subscription_tier AS plan_subscription_tier,
         usage_history.api_usage,
         usage_history.storage_usage
      FROM
        users
      LEFT JOIN
        plans ON users.plan_id = plans.id
        LEFT JOIN
  usage_history ON users.id = usage_history.user_id AND usage_history.status = 'active'
      WHERE
        users.id = $1;
    `;

      const response = await this.databaseService.query(query, [
        queryParameter.userId,
      ]);

      if (!response.rows.length) {
        throw new HttpException('User not found', 404);
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
