"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _util = require("../util");
const _authservice = require("./auth.service");
const _types = require("./types");
const _express = require("express");
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
let AuthController = class AuthController {
    // API endpoint to register a user
    async register(createUserDto, response) {
        const result = await this.authService.register(createUserDto); // Call the register method in AuthService
        return _util.HttpResponse.created(response, result, 'User created successfully'); // Return a created response with custom message
    }
    // API endpoint to log in a user
    async login(loginUserDto, response) {
        const result = await this.authService.login(loginUserDto); // Call the login method in AuthService
        return _util.HttpResponse.ok(response, result, 'User login successful'); // Return an OK response with custom message
    }
    constructor(authService){
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'User created successfully'
    }) // Add Swagger response annotation
    ,
    (0, _common.Post)('register'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.CreateUserDto === "undefined" ? Object : _types.CreateUserDto,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ])
], AuthController.prototype, "register", null);
_ts_decorate([
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User login successful'
    }) // Add Swagger response annotation
    ,
    (0, _common.Post)('login'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.LoginUserDto === "undefined" ? Object : _types.LoginUserDto,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ])
], AuthController.prototype, "login", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('auth') // Tag the controller with 'auth' for Swagger documentation
    ,
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);
