"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlanDataFactory", {
    enumerable: true,
    get: function() {
        return PlanDataFactory;
    }
});
const _common = require("@nestjs/common");
const _dbPool = require("./dbPool");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PlanDataFactory = class PlanDataFactory {
    async getPlans() {
        const query = `SELECT id, name, description, price, subscription_tier, usage_limits, currency, payment_frequency
FROM plans;
`;
        const response = await this.databaseService.query(query);
        return response.rows;
    }
    async getPlan(planId) {
        const query = `
    SELECT id, name, description, price, subscription_tier, usage_limits, currency, payment_frequency
    FROM plans
    WHERE id = $1;
  `;
        const values = [
            planId
        ];
        try {
            const response = await this.databaseService.query(query, values);
            return response.rows[0];
        } catch (error) {
            throw error;
        }
    }
    async getSubscriptionAndUsage(queryParameter) {
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
                queryParameter.userId
            ]);
            if (!response.rows.length) {
                throw new _common.HttpException('User not found', 404);
            }
            return response.rows[0];
        } catch (error) {
            throw error;
        }
    }
    async createSubscriptionAndUsage(subscription, usageDetails) {
        const query = `
      INSERT INTO subscriptions(
        ${Object.keys(subscription).join(', ')}
      )
      VALUES (${Object.keys(subscription).map((_, index)=>`$${index + 1}`).join(', ')})
      RETURNING id, name;
    `;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const values = Object.entries(subscription).map(([_, value])=>value);
        try {
            //Begin a transaction
            await this.databaseService.query('BEGIN');
            const subscriptionResponse = await this.databaseService.query(query, values);
            const usageQuery = `
      INSERT INTO usage_history(
        ${Object.keys(usageDetails).join(', ')}
      )
      VALUES (${Object.keys(usageDetails).map((_, index)=>`$${index + 1}`).join(', ')})
      RETURNING id;
    `;
            const usageValues = Object.entries(usageDetails).map(// eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, value])=>value);
            await this.databaseService.query(usageQuery, usageValues);
            await this.databaseService.query('COMMIT'); // Commit the transaction
            return subscriptionResponse.rows[0];
        } catch (error) {
            await this.databaseService.query('ROLLBACK');
            throw error;
        }
    }
    constructor(databaseService){
        this.databaseService = databaseService;
    }
};
PlanDataFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dbPool.DatabaseService === "undefined" ? Object : _dbPool.DatabaseService
    ])
], PlanDataFactory);
