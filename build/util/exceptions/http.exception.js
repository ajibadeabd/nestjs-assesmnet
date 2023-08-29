"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HttpExceptionFilter", {
    enumerable: true,
    get: function() {
        return HttpExceptionFilter;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        console.log(exception);
        const status = exception instanceof _common.HttpException ? exception.getStatus() : _common.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof _common.HttpException ? exception.getResponse().message || exception.getResponse().stacktrace?.message || exception.getResponse().stacktrace || exception.message : 'An Error Occurred';
        const exeptionResponse = exception?.getResponse?.();
        const extraData = typeof exeptionResponse === 'object' ? exeptionResponse : {};
        return response.status(status).json({
            ...extraData,
            status: false,
            statusCode: status,
            message
        });
    }
};
HttpExceptionFilter = _ts_decorate([
    (0, _common.Catch)()
], HttpExceptionFilter);
