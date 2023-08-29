"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsageDataFactory", {
    enumerable: true,
    get: function() {
        return UsageDataFactory;
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
let UsageDataFactory = class UsageDataFactory {
    async createPlanUsageAndBilling(userId, startDate, endDate) {
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
        const values = [
            userId,
            startDate,
            endDate,
            0,
            0,
            'active'
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
UsageDataFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dbPool.DatabaseService === "undefined" ? Object : _dbPool.DatabaseService
    ])
], UsageDataFactory);
