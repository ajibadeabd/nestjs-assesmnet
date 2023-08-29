"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserService", {
    enumerable: true,
    get: function() {
        return UserService;
    }
});
const _common = require("@nestjs/common");
const _userfactory = require("../databaseFactory/user.factory");
const _planfactory = require("../databaseFactory/plan.factory");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserService = class UserService {
    async getUser(queryParameters, excludeProperties = false) {
        return this.userDataFactory.getUser(queryParameters, excludeProperties);
    }
    async updateUserDetails(planId, email) {
        return this.userDataFactory.updateUserDetails(planId, email);
    }
    async getUserSubscriptionWithPlan(queryParameters) {
        const response = await this.subscriptionDataFactory.getSubscriptionAndUsage(queryParameters);
        return response;
    }
    createUser(createUserDto) {
        return this.userDataFactory.createUser(createUserDto);
    }
    constructor(userDataFactory, subscriptionDataFactory){
        this.userDataFactory = userDataFactory;
        this.subscriptionDataFactory = subscriptionDataFactory;
    }
};
UserService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userfactory.UserDataFactory === "undefined" ? Object : _userfactory.UserDataFactory,
        typeof _planfactory.PlanDataFactory === "undefined" ? Object : _planfactory.PlanDataFactory
    ])
], UserService);
