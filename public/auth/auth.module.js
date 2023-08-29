"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _jwt = require("@nestjs/jwt");
const _userfactory = require("../databaseFactory/user.factory");
const _userservice = require("../user/user.service");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
const _jwtstrategy = require("./strategies/jwt.strategy");
const _databasemodule = require("../databaseFactory/database.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot(),
            _jwt.JwtModule.registerAsync({
                imports: [
                    _config.ConfigModule
                ],
                useFactory: async ()=>({
                        signOptions: {
                            expiresIn: '366d'
                        },
                        secret: process.env.JWT_SECRET_KEY || 'JWT_SECRET'
                    }),
                inject: [
                    _config.ConfigService
                ]
            }),
            _databasemodule.DatabaseModule
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _authservice.AuthService,
            _userservice.UserService,
            // DatabaseService,
            _jwtstrategy.JwtStrategy,
            _userfactory.UserDataFactory
        ]
    })
], AuthModule);
