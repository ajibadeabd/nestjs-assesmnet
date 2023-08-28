import { expose } from 'threads/worker';
import { calculateBillingAmount } from 'bill_amount';
import { calculateRenewalAndExpiration } from '../util';
import { decrypt } from '../util/index';
import Axios from 'axios';

import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mydb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});
const pooClient = pool.connect();
const secretKey = process.env.AUTHCODE_SECRET_KEY || 'your-secret-key-here';

export const newWorker = expose({
  async debitUser({
    userId,
    amount,
    planId,
    payment_frequency,
    email,
    currency,
  }) {
    let query = `
    SELECT auth_code
        FROM payment_details
        WHERE user_id = $1;
`;
    const payment_details = await (await pooClient).query(query, [userId]);
    const { auth_code } = payment_details.rows[0];
    let decodedToken = decrypt(auth_code, secretKey);
    if (decodedToken != '') {
      const body = {
        authorization_code: decodedToken,
        amount,
        email,
        currency,
        metadata: { planId, billingCycle: payment_frequency },
      };
      try {
        // charge user again
        await Axios.post(
          process.env.PAYSTACK_BASE_URL + '/transaction/charge_authorization',
          body,
          {
            headers: {
              authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
            },
          },
        );
        return { auth_code, status: decodedToken != '' ? true : false };
      } catch (error) {
        console.error('Error:');
        return { status: false };
      }
    }
    // return { auth_code, status: decodedToken != '' ? true : false };
  },
  async updateFormalUsage(userId) {
    const updateQuery = `
    UPDATE usage_history
    SET status = 'not_active'
    WHERE user_id = $1  AND status = 'active';
  `;
    const updateValues = [userId];
    await (await pooClient).query(updateQuery, updateValues);
    return pooClient.then(async (client) => {
      await client.release();
      await pool.end();
    });
  },
  async getBillingDetails(subscriptionResponse) {
    const subscriptionPlan = {
      price: subscriptionResponse.plan_price,
      id: subscriptionResponse.plan_id,
      usage_limits: subscriptionResponse.plan_usage,
      currency: subscriptionResponse.currency,
      payment_frequency: subscriptionResponse.billing_cycle,
    };

    const usageData = {
      storage: {
        used: subscriptionResponse.storage_usage,
      },
      api_calls: {
        used: subscriptionResponse.api_usage,
      },
    };
    const response = calculateBillingAmount({
      subscriptionPlan,
      usageData,
    });

    response['userId'] = subscriptionResponse.user_id;
    response['amount'] = subscriptionResponse.plan_price;
    response['currency'] = subscriptionResponse.currency;
    response['email'] = subscriptionResponse.user_email;
    response['planId'] = subscriptionResponse.plan_id;
    response['payment_frequency'] = subscriptionResponse.billing_cycle;
    return response;
  },
});
