"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentService", {
    enumerable: true,
    get: function() {
        return PaymentService;
    }
});
const _common = require("@nestjs/common");
const _axios = require("@nestjs/axios");
const _rxjs = require("rxjs");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PaymentService = class PaymentService {
    async post(url, headers, data) {
        const config = {
            headers: headers
        };
        try {
            const response = await (0, _rxjs.firstValueFrom)(this.httpService.post(url, data, config));
            if (!response.data.status) {
                throw new _common.HttpException(response.data.message, 400);
            }
            return response.data;
        } catch (error) {
            // Handle errors here
            throw new _common.HttpException(error?.response?.data?.message || 'error occur  ', 400);
        }
    }
    constructor(httpService){
        this.httpService = httpService;
    }
};
PaymentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService
    ])
], PaymentService);
