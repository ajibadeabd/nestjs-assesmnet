"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseModule", {
    enumerable: true,
    get: function() {
        return DatabaseModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _dbPool = require("./dbPool");
const _userfactory = require("./user.factory");
const _planfactory = require("./plan.factory");
const _usagefactory = require("./usage.factory");
const _paymentdetailsfactory = require("./payment.details.factory");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot()
        ],
        controllers: [],
        providers: [
            _dbPool.DatabaseService,
            _userfactory.UserDataFactory,
            _usagefactory.UsageDataFactory,
            _planfactory.PlanDataFactory,
            _paymentdetailsfactory.PaymentDetailsFactory
        ],
        exports: [
            _dbPool.DatabaseService,
            _userfactory.UserDataFactory,
            _paymentdetailsfactory.PaymentDetailsFactory,
            _usagefactory.UsageDataFactory,
            _planfactory.PlanDataFactory
        ]
    })
], DatabaseModule);
