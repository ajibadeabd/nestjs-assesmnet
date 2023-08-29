"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductController", {
    enumerable: true,
    get: function() {
        return ProductController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _util = require("../util");
const _productservice = require("./product.service");
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
let ProductController = class ProductController {
    async getProducts(response) {
        const result = await this.productService.getAvailableProducts();
        return _util.HttpResponse.ok(response, {
            result
        }, 'Products retrieved successfully');
    }
    constructor(productService){
        this.productService = productService;
    }
};
_ts_decorate([
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Products retrieved successfully'
    }),
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ])
], ProductController.prototype, "getProducts", null);
ProductController = _ts_decorate([
    (0, _swagger.ApiTags)('products') // Tag the controller with 'products' for Swagger documentation
    ,
    (0, _common.Controller)('products'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productservice.ProductService === "undefined" ? Object : _productservice.ProductService
    ])
], ProductController);
