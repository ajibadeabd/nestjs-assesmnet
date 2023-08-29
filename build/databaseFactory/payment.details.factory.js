"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentDetailsFactory", {
    enumerable: true,
    get: function() {
        return PaymentDetailsFactory;
    }
});
const _common = require("@nestjs/common");
const _util = require("../util");
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
let PaymentDetailsFactory = class PaymentDetailsFactory {
    async savePaymentAuthCode(userId, authCode) {
        const query = `
    INSERT INTO payment_details (user_id, auth_code, payment_date)
    VALUES ($1, $2, NOW());
  `;
        const secretKey = process.env.AUTHCODE_SECRET_KEY || 'your-secret-key-here';
        const values = [
            userId,
            (0, _util.encrypt)(authCode, secretKey)
        ];
        try {
            await this.databaseService.query(query, values);
        } catch (error) {
        //throw error;
        }
    }
    constructor(databaseService){
        this.databaseService = databaseService;
    }
};
PaymentDetailsFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dbPool.DatabaseService === "undefined" ? Object : _dbPool.DatabaseService
    ])
], PaymentDetailsFactory);
