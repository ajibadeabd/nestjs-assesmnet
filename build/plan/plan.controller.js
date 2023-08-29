"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlansController", {
    enumerable: true,
    get: function() {
        return PlansController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _util = require("../util");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _planservice = require("./plan.service");
const _types = require("./types");
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
let PlansController = class PlansController {
    async getPlans(response) {
        const result = await this.plansService.getAvailablePlans();
        return _util.HttpResponse.ok(response, result, 'Plans retrieved successfully');
    }
    async paymentResponse(response, userData) {
        await this.plansService.createSubscription(userData);
        return _util.HttpResponse.ok(response, {}, 'Plans retrieved successfully');
    }
    async billUser(userData, response) {
        await this.plansService.billUser(userData.userId);
        return _util.HttpResponse.created(response, null, 'User billed successfully');
    }
    async createSubscription(planIdValidation, request, response) {
        const planId = planIdValidation.planId;
        const result = await this.plansService.initializePayment(planId, request.user);
        return _util.HttpResponse.created(response, result, 'Plan created successfully');
    }
    constructor(plansService){
        this.plansService = plansService;
    }
};
_ts_decorate([
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Plans retrieved successfully'
    }) // Add Swagger response annotation
    ,
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ])
], PlansController.prototype, "getPlans", null);
_ts_decorate([
    (0, _common.Post)('callback'),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        void 0
    ])
], PlansController.prototype, "paymentResponse", null);
_ts_decorate([
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'User billed successfully'
    }) // Add Swagger response annotation
    ,
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Post)('bill'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.UserIdValidation === "undefined" ? Object : _types.UserIdValidation,
        void 0
    ])
], PlansController.prototype, "billUser", null);
_ts_decorate([
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Plan created successfully'
    }) // Add Swagger response annotation
    ,
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)(''),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.PlanIdValidation === "undefined" ? Object : _types.PlanIdValidation,
        void 0,
        void 0
    ])
], PlansController.prototype, "createSubscription", null);
PlansController = _ts_decorate([
    (0, _swagger.ApiTags)('plans') // Tag the controller with 'plans' for Swagger documentation
    ,
    (0, _common.Controller)('plans'),
    (0, _swagger.ApiTags)('plans'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _planservice.PlansService === "undefined" ? Object : _planservice.PlansService
    ])
], PlansController);
