"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentDetailsService", {
    enumerable: true,
    get: function() {
        return PaymentDetailsService;
    }
});
const _common = require("@nestjs/common");
const _paymentdetailsfactory = require("../databaseFactory/payment.details.factory");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PaymentDetailsService = class PaymentDetailsService {
    async savePaymentAuthCode(userId, authCode) {
        return this.paymentDetailsFactory.savePaymentAuthCode(userId, authCode);
    }
    constructor(paymentDetailsFactory){
        this.paymentDetailsFactory = paymentDetailsFactory;
    }
};
PaymentDetailsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paymentdetailsfactory.PaymentDetailsFactory === "undefined" ? Object : _paymentdetailsfactory.PaymentDetailsFactory
    ])
], PaymentDetailsService);
