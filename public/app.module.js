"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _authmodule = require("./auth/auth.module");
const _messagemodule = require("./message-broker/message.module");
const _planmodule = require("./plan/plan.module");
const _paymentmodule = require("./payment/payment.module");
const _servestatic = require("@nestjs/serve-static");
const _path = require("path");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _servestatic.ServeStaticModule.forRoot({
                rootPath: (0, _path.join)(__dirname, '..', 'swagger-static'),
                serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger'
            }),
            _authmodule.AuthModule,
            _paymentmodule.PaymentModule,
            _planmodule.PlanModule,
            _messagemodule.BrokerModule
        ]
    })
], AppModule);
