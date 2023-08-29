"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _authcontroller = require("./auth.controller");
describe('AuthController', ()=>{
    let authController;
    let authService;
    beforeEach(()=>{
        authService = {
            register: jest.fn(),
            login: jest.fn()
        };
        authController = new _authcontroller.AuthController(authService);
    });
    describe('register', ()=>{
        it('should register a new user', async ()=>{
            const createUserDto = {
                name: 'test',
                email: 'test@example.com',
                password: 'password123'
            };
            const mockResponse = {
                id: 'id',
                email: createUserDto.email,
                created_at: new Date(),
                name: 'test',
                updated_at: new Date()
            };
            jest.spyOn(authService, 'register').mockResolvedValue(mockResponse);
            const responseMock = {
                // Mock the relevant response methods you're using
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await authController.register(createUserDto, responseMock);
            expect(authService.register).toHaveBeenCalledWith(createUserDto);
            expect(responseMock.status).toHaveBeenCalledWith(201);
            expect(responseMock.json).toHaveBeenCalledWith({
                message: 'User created successfully',
                data: mockResponse
            });
        });
    });
    describe('login', ()=>{
        it('should login a user', async ()=>{
            const loginUserDto = {
                email: 'test@example.com',
                password: 'password123'
            };
            const mockResponse = {
                token: 'mocked_token',
                user: {
                    id: '1',
                    email: 'test@example.com',
                    created_at: new Date(),
                    name: 'test',
                    updated_at: new Date()
                }
            };
            jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);
            const responseMock = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await authController.login(loginUserDto, responseMock);
            expect(authService.login).toHaveBeenCalledWith(loginUserDto);
            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.json).toHaveBeenCalledWith({
                message: 'User login successful',
                data: mockResponse
            });
        });
    });
});
