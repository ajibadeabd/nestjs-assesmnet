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
    CreateUserDto: function() {
        return CreateUserDto;
    },
    LoginUserDto: function() {
        return LoginUserDto;
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
let CreateUserDto = class CreateUserDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'John Doe'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Name cannot be empty'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'johndoe@example.com'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Email cannot be empty'
    }),
    (0, _classvalidator.IsEmail)({}, {
        message: 'Invalid email format'
    }),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'secretpassword'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password cannot be empty'
    }),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
let LoginUserDto = class LoginUserDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'johndoe@example.com'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Email cannot be empty'
    }),
    (0, _classvalidator.IsEmail)({}, {
        message: 'Invalid email format'
    }),
    _ts_metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'secretpassword'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password cannot be empty'
    }),
    _ts_metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);
