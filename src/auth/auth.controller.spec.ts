import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './types';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    } as any;

    authController = new AuthController(authService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        id: 'id',
        email: createUserDto.email,
        created_at: new Date(),
        name: 'test',
        updated_at: new Date(),
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockResponse);

      const responseMock: Partial<Response> = {
        // Mock the relevant response methods you're using
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.register(createUserDto, responseMock as Response);

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(responseMock.status).toHaveBeenCalledWith(201);
      expect(responseMock.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        data: mockResponse,
      });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        token: 'mocked_token',
        user: {
          id: '1',
          email: 'test@example.com',
          created_at: new Date(),
          name: 'test',
          updated_at: new Date(),
        },
      };
      jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

      const responseMock: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.login(loginUserDto, responseMock as Response);

      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.json).toHaveBeenCalledWith({
        message: 'User login successful',
        data: mockResponse,
      });
    });
  });
});
