"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BrokerController", {
    enumerable: true,
    get: function() {
        return BrokerController;
    }
});
const _common = require("@nestjs/common");
const _microservices = require("@nestjs/microservices");
const _usagefactory = require("../databaseFactory/usage.factory");
const _threads = require("threads");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let BrokerController = class BrokerController {
    async handleTicketProcessing(data) {
        return new Promise(async (resolve)=>{
            const worker = await (0, _threads.spawn)(new _threads.Worker('./billing.worker.js'));
            const response = await worker.getBillingDetails(JSON.parse(data));
            const { status } = await worker.debitUser({
                currency: response.currency,
                amount: response.amount,
                email: response.email,
                planId: response.planId,
                userId: response.userId,
                payment_frequency: response.payment_frequency
            });
            if (status) {
                await worker.updateFormalUsage(response.userId);
            }
            await _threads.Thread.terminate(worker);
            resolve(response);
        });
    }
    constructor(usageDataFactory){
        this.usageDataFactory = usageDataFactory;
    }
};
_ts_decorate([
    (0, _microservices.EventPattern)('calculate_billing'),
    _ts_param(0, (0, _microservices.Payload)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ])
], BrokerController.prototype, "handleTicketProcessing", null);
BrokerController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usagefactory.UsageDataFactory === "undefined" ? Object : _usagefactory.UsageDataFactory
    ])
], BrokerController);
