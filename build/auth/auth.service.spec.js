"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _authservice = require("./auth.service");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _common = require("@nestjs/common");
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
describe('AuthService', ()=>{
    let authService;
    let userService;
    let jwtService;
    let userDataFactory;
    const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password'
    };
    beforeEach(async ()=>{
        userService = {
            getUser: jest.fn()
        };
        jwtService = {
            sign: jest.fn()
        };
        userDataFactory = {
            createUser: jest.fn()
        };
        authService = new _authservice.AuthService(userService, jwtService, userDataFactory);
    });
    describe('register', ()=>{
        it('should register a new user', async ()=>{
            const createUserDto = {
                name: 'test ',
                email: 'test@example.com',
                password: 'password123'
            };
            const hashedPassword = await _bcrypt.hash(createUserDto.password, 10);
            const newUser = {
                ...createUserDto,
                password: hashedPassword
            };
            const mockResponse = {
                ...newUser,
                id: 'id',
                created_at: new Date(),
                updated_at: new Date()
            };
            jest.spyOn(userDataFactory, 'createUser').mockImplementation(()=>Promise.resolve(mockResponse));
            const result = await authService.register(createUserDto);
            expect(result).toEqual(mockResponse);
            expect(userDataFactory.createUser).toHaveBeenCalledWith(createUserDto);
        });
        it('should not register an existing  user', async ()=>{
            const createUserDto = {
                name: 'test ',
                email: 'test@example.com',
                password: 'password123'
            };
            jest.spyOn(userDataFactory, 'createUser').mockRejectedValue({
                code: '23505'
            });
            await expect(authService.register(createUserDto)).rejects.toThrow(new _common.HttpException('A user with this email already exists', 400));
        });
        it('should not register when occur while creating it', async ()=>{
            const createUserDto = {
                name: 'test ',
                email: 'test@example.com',
                password: 'password123'
            };
            jest.spyOn(userDataFactory, 'createUser').mockRejectedValue(new Error());
            await expect(authService.register(createUserDto)).rejects.toThrow(new _common.HttpException('Error occurred while creating an account', 400));
        });
    });
    describe('login', ()=>{
        it('should login a user', async ()=>{
            const loginUserDto = {
                email: 'test@example.com',
                password: 'password123'
            };
            const userResponseValue = {
                name: 'name',
                created_at: new Date(),
                updated_at: new Date(),
                ...mockUser
            };
            // Mock the behavior of userService.getUser to return the mockUser
            jest.spyOn(userService, 'getUser').mockResolvedValue(userResponseValue);
            // Mock bcrypt.compare to always return true
            jest.spyOn(_bcrypt, 'compare').mockResolvedValue(true);
            jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');
            const result = await authService.login(loginUserDto);
            // Define the expected result
            const expectedUser = {
                ...mockUser
            };
            const expectedToken = 'mocked_token';
            const expectedResponse = {
                token: expectedToken,
                user: expectedUser
            };
            expect(result.token).toEqual(expectedResponse.token);
            expect(result.user.id).toEqual(expectedResponse.user.id);
            expect(userService.getUser).toHaveBeenCalledWith({
                email: loginUserDto.email
            });
            expect(_bcrypt.compare).toHaveBeenCalledWith(loginUserDto.password, mockUser.password);
            expect(jwtService.sign).toHaveBeenCalledWith({
                id: mockUser.id,
                email: mockUser.email
            });
        });
        it('should not login a user with invalid credential(password)', async ()=>{
            const loginUserDto = {
                email: 'wrong test@example.com',
                password: 'wrong password'
            };
            jest.spyOn(userService, 'getUser').mockResolvedValue(null);
            await expect(authService.login(loginUserDto)).rejects.toThrow(new _common.HttpException('Invalid credentials', 400));
        });
        it('should not login a user with invalid credential(password)', async ()=>{
            const loginUserDto = {
                email: 'test@example.com',
                password: 'wrong pass'
            };
            jest.spyOn(userService, 'getUser').mockResolvedValue(null);
            await expect(authService.login(loginUserDto)).rejects.toThrow(new _common.HttpException('Invalid credentials', 400));
        });
    });
});
