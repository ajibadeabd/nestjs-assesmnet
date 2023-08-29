"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentDetailsModule", {
    enumerable: true,
    get: function() {
        return PaymentDetailsModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _databasemodule = require("../databaseFactory/database.module");
const _paymentdetailsservice = require("./payment.details.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PaymentDetailsModule = class PaymentDetailsModule {
};
PaymentDetailsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot(),
            _databasemodule.DatabaseModule
        ],
        controllers: [],
        providers: [
            _paymentdetailsservice.PaymentDetailsService
        ],
        exports: [
            _paymentdetailsservice.PaymentDetailsService
        ]
    })
], PaymentDetailsModule);
