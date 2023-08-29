"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "newWorker", {
    enumerable: true,
    get: function() {
        return newWorker;
    }
});
const _worker = require("threads/worker");
const _bill_amount = require("bill_amount");
const _index = require("../util/index");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _pg = require("pg");
const _dotenv = require("dotenv");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
(0, _dotenv.config)();
const pool = new _pg.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mydb',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432
});
const pooClient = pool.connect();
const secretKey = process.env.AUTHCODE_SECRET_KEY || 'your-secret-key-here';
const newWorker = (0, _worker.expose)({
    async debitUser ({ userId, amount, planId, payment_frequency, email, currency }) {
        let query = `
    SELECT auth_code
        FROM payment_details
        WHERE user_id = $1;
`;
        const payment_details = await (await pooClient).query(query, [
            userId
        ]);
        const { auth_code } = payment_details.rows[0];
        let decodedToken = (0, _index.decrypt)(auth_code, secretKey);
        if (decodedToken != '') {
            const body = {
                authorization_code: decodedToken,
                amount,
                email,
                currency,
                metadata: {
                    planId,
                    billingCycle: payment_frequency
                }
            };
            try {
                // charge user again
                const response = await _axios.default.post(process.env.PAYSTACK_BASE_URL + '/transaction/charge_authorization', body, {
                    headers: {
                        authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY
                    }
                });
                return {
                    auth_code,
                    status: decodedToken != '' ? true : false
                };
            } catch (error) {
                console.error('Error:');
                return {
                    status: false
                };
            }
        }
    // return { auth_code, status: decodedToken != '' ? true : false };
    },
    async updateFormalUsage (userId) {
        const updateQuery = `
    UPDATE usage_history
    SET status = 'not_active'
    WHERE user_id = $1  AND status = 'active';
  `;
        const updateValues = [
            userId
        ];
        await (await pooClient).query(updateQuery, updateValues);
        return pooClient.then(async (client)=>{
            await client.release();
            await pool.end();
        });
    },
    async getBillingDetails (subscriptionResponse) {
        const subscriptionPlan = {
            price: subscriptionResponse.plan_price,
            id: subscriptionResponse.plan_id,
            usage_limits: subscriptionResponse.plan_usage,
            currency: subscriptionResponse.currency,
            payment_frequency: subscriptionResponse.billing_cycle
        };
        const usageData = {
            storage: {
                used: subscriptionResponse.storage_usage
            },
            api_calls: {
                used: subscriptionResponse.api_usage
            }
        };
        const response = (0, _bill_amount.calculateBillingAmount)({
            subscriptionPlan,
            usageData
        });
        response['userId'] = subscriptionResponse.user_id;
        response['amount'] = subscriptionResponse.plan_price;
        response['currency'] = subscriptionResponse.currency;
        response['email'] = subscriptionResponse.user_email;
        response['planId'] = subscriptionResponse.plan_id;
        response['payment_frequency'] = subscriptionResponse.billing_cycle;
        return response;
    }
});
