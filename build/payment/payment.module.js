"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentModule", {
    enumerable: true,
    get: function() {
        return PaymentModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _usermodule = require("../user/user.module");
const _databasemodule = require("../databaseFactory/database.module");
const _paymentservice = require("./payment.service");
const _axios = require("@nestjs/axios");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PaymentModule = class PaymentModule {
};
PaymentModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot(),
            _axios.HttpModule,
            _databasemodule.DatabaseModule,
            _usermodule.UserModule
        ],
        controllers: [],
        providers: [
            _paymentservice.PaymentService
        ],
        exports: [
            _paymentservice.PaymentService
        ]
    })
], PaymentModule);
