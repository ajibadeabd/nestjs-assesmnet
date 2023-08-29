"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingDataFactory", {
    enumerable: true,
    get: function() {
        return BillingDataFactory;
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
let BillingDataFactory = class BillingDataFactory {
    async saveBilling(userId, billingDate, totalAmount, paymentStatus) {
        const query = `
    INSERT INTO billing_history (user_id, billing_date, total_amount, payment_status)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;
        const values = [
            userId,
            billingDate,
            totalAmount,
            paymentStatus
        ];
        try {
            const response = await this.databaseService.query(query, values);
            return response.rows[0].id;
        } catch (error) {
            throw error;
        }
    }
    constructor(databaseService){
        this.databaseService = databaseService;
    }
};
BillingDataFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dbPool.DatabaseService === "undefined" ? Object : _dbPool.DatabaseService
    ])
], BillingDataFactory);
