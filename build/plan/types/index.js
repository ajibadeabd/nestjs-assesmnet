"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PlanIdValidation: function() {
        return PlanIdValidation;
    },
    UserIdValidation: function() {
        return UserIdValidation;
    },
    PlanDto: function() {
        return PlanDto;
    },
    SubscriptionDto: function() {
        return SubscriptionDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PlanIdValidation = class PlanIdValidation {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '7187364c-47f2-4642-8770-58d85aca81eb'
    }),
    (0, _classvalidator.IsUUID)('4', {
        message: 'User ID must be a valid UUID'
    }),
    _ts_metadata("design:type", String)
], PlanIdValidation.prototype, "planId", void 0);
let UserIdValidation = class UserIdValidation {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '045f6655-ff69-4d76-bda1-20881c2d8e9d'
    }) // Add ApiProperty decorator with example value
    ,
    (0, _classvalidator.IsUUID)('4', {
        message: 'User ID must be a valid UUID'
    }),
    _ts_metadata("design:type", String)
], UserIdValidation.prototype, "userId", void 0);
let PlanDto = class PlanDto {
};
let UsageLimits = class UsageLimits {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsObject)(),
    _ts_metadata("design:type", Object)
], UsageLimits.prototype, "storage", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsObject)(),
    _ts_metadata("design:type", Object)
], UsageLimits.prototype, "api_calls", void 0);
let SubscriptionDto = class SubscriptionDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "id", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], SubscriptionDto.prototype, "price", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "subscription_tier", void 0);
_ts_decorate([
    (0, _classvalidator.IsObject)(),
    _ts_metadata("design:type", typeof UsageLimits === "undefined" ? Object : UsageLimits)
], SubscriptionDto.prototype, "usage_limits", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "currency", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "payment_frequency", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "billing_cycle", void 0);
_ts_decorate([
    (0, _classvalidator.IsDate)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "renewal_date", void 0);
_ts_decorate([
    (0, _classvalidator.IsDate)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], SubscriptionDto.prototype, "expiration_date", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "user_id", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "cancellation_policy", void 0);
_ts_decorate([
    (0, _classvalidator.IsDate)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], SubscriptionDto.prototype, "updated_at", void 0);
