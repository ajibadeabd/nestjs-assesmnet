"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _userservice = require("../user/user.service");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _jwt = require("@nestjs/jwt");
const _userfactory = require("../databaseFactory/user.factory");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthService = class AuthService {
    // Register a new user
    async register(createUserDto) {
        try {
            createUserDto.password = await _bcrypt.hash(createUserDto.password, 10); // Hash the password before saving
            const newUser = await this.userDataFactory.createUser(createUserDto); // Create user using the factory
            return newUser; // Return the created user
        } catch (error) {
            if (error.code === '23505') {
                // Check for duplicate email error
                throw new _common.HttpException('A user with this email already exists', 400);
            }
            throw new _common.HttpException('Error occurred while creating an account', 400);
        }
    }
    // User login
    async login(loginUserDto) {
        const user = await this.userService.getUser({
            email: loginUserDto.email
        }); // Find user by email
        if (!user) throw new _common.HttpException('Invalid credentials', 404); // Throw error if user not found
        // Compare passwords
        const passwordsMatch = await _bcrypt.compare(loginUserDto.password, user.password);
        if (!passwordsMatch) {
            throw new _common.HttpException('Invalid credentials', 400); // Throw error if passwords don't match
        }
        delete user.password; // Remove password from the returned user object
        const payload = {
            id: user.id,
            email: user.email
        };
        // Create a token
        const token = this.jwtService.sign(payload);
        return {
            token,
            user
        };
    }
    constructor(userService, jwtService, userDataFactory){
        this.userService = userService;
        this.jwtService = jwtService;
        this.userDataFactory = userDataFactory;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _userfactory.UserDataFactory === "undefined" ? Object : _userfactory.UserDataFactory
    ])
], AuthService);
