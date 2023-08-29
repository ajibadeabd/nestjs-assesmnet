"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BrokerService", {
    enumerable: true,
    get: function() {
        return BrokerService;
    }
});
const _common = require("@nestjs/common");
const _microservices = require("@nestjs/microservices");
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
let BrokerService = class BrokerService {
    async processBilling(data) {
        this.RmqService.emit('calculate_billing', JSON.stringify(data));
    }
    constructor(RmqService){
        this.RmqService = RmqService;
    }
};
BrokerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)('BROKER_SERVICES_CLIENT')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _microservices.ClientRMQ === "undefined" ? Object : _microservices.ClientRMQ
    ])
], BrokerService);
