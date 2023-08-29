"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlansService", {
    enumerable: true,
    get: function() {
        return PlansService;
    }
});
const _common = require("@nestjs/common");
const _planfactory = require("../databaseFactory/plan.factory");
const _util = require("../util");
const _userservice = require("../user/user.service");
const _messageservice = require("../message-broker/message.service");
const _paymentservice = require("../payment/payment.service");
const _usagefactory = require("../databaseFactory/usage.factory");
const _paymentdetailsservice = require("../paymentDetails/payment.details.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PlansService = class PlansService {
    async getAvailablePlans() {
        return this.planDataFactory.getPlans();
    }
    async billUser(userId) {
        const subscriptionResponse = await this.userService.getUserSubscriptionWithPlan({
            userId
        });
        this.brokerService.processBilling(subscriptionResponse);
        console.log('done');
        return;
    }
    async createSubscription({ data, event }) {
        if (event !== 'charge.success') {
            console.log('notify users that their payment failed');
            return;
        }
        const { id } = await this.userService.updateUserDetails(data.metadata.planId, data.customer.email);
        await this.createSubscriptionUsageAndBilling(id, data.metadata.billingCycle);
        await this.paymentDetailsService.savePaymentAuthCode(id, data.authorization.authorization_code);
    }
    async createSubscriptionUsageAndBilling(userId, billingCycle) {
        const { startDate, expirationDate } = (0, _util.calculateRenewalAndExpiration)(billingCycle, new Date());
        return this.usageDataFactory.createPlanUsageAndBilling(userId, startDate, expirationDate);
    }
    async initializePayment(planId, user) {
        if (user.plan_id) {
            throw new _common.HttpException('You are already subscribed to a plan. You cannot subscribe again.', 400);
        }
        const plan = await this.planDataFactory.getPlan(planId);
        if (!plan) {
            throw new _common.HttpException('Plan does not exist', 400);
        }
        try {
            const paymentResponse = await this.paymentService.post(process.env.PAYSTACK_BASE_URL + '/transaction/initialize', {
                authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY
            }, {
                email: user.email,
                amount: +plan.price,
                planId,
                currency: plan.currency,
                metadata: {
                    planId,
                    billingCycle: plan.payment_frequency
                }
            });
            return paymentResponse.data;
        } catch (error) {
            throw error;
        }
    }
    constructor(planDataFactory, userService, brokerService, usageDataFactory, paymentService, paymentDetailsService){
        this.planDataFactory = planDataFactory;
        this.userService = userService;
        this.brokerService = brokerService;
        this.usageDataFactory = usageDataFactory;
        this.paymentService = paymentService;
        this.paymentDetailsService = paymentDetailsService;
    }
};
PlansService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _planfactory.PlanDataFactory === "undefined" ? Object : _planfactory.PlanDataFactory,
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService,
        typeof _messageservice.BrokerService === "undefined" ? Object : _messageservice.BrokerService,
        typeof _usagefactory.UsageDataFactory === "undefined" ? Object : _usagefactory.UsageDataFactory,
        typeof _paymentservice.PaymentService === "undefined" ? Object : _paymentservice.PaymentService,
        typeof _paymentdetailsservice.PaymentDetailsService === "undefined" ? Object : _paymentdetailsservice.PaymentDetailsService
    ])
], PlansService);
