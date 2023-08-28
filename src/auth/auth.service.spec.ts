import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDataFactory } from '../databaseFactory/user.factory';
import { CreateUserDto, LoginUserDto } from './types';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let userDataFactory: UserDataFactory;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashed_password',
  };

  beforeEach(async () => {
    userService = {
      getUser: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
    } as any;

    userDataFactory = {
      createUser: jest.fn(),
    } as any;

    authService = new AuthService(userService, jwtService, userDataFactory);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test ',
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = { ...createUserDto, password: hashedPassword };

      const mockResponse = {
        ...newUser,
        id: 'id',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(userDataFactory, 'createUser')
        .mockImplementation(() => Promise.resolve(mockResponse));
      const result = await authService.register(createUserDto);
      expect(result).toEqual(mockResponse);
      expect(userDataFactory.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should not register an existing  user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test ',
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(userDataFactory, 'createUser')
        .mockRejectedValue({ code: '23505' });

      await expect(authService.register(createUserDto)).rejects.toThrow(
        new HttpException('A user with this email already exists', 400),
      );
    });
    it('should not register when occur while creating it', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test ',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userDataFactory, 'createUser').mockRejectedValue(new Error());

      await expect(authService.register(createUserDto)).rejects.toThrow(
        new HttpException('Error occurred while creating an account', 400),
      );
    });
  });
  describe('login', () => {
    it('should login a user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userResponseValue = {
        name: 'name',
        created_at: new Date(),
        updated_at: new Date(),
        ...mockUser,
      };
      // Mock the behavior of userService.getUser to return the mockUser
      jest.spyOn(userService, 'getUser').mockResolvedValue(userResponseValue);

      // Mock bcrypt.compare to always return true
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');

      const result = await authService.login(loginUserDto);

      // Define the expected result
      const expectedUser = { ...mockUser };
      const expectedToken = 'mocked_token';
      const expectedResponse = {
        token: expectedToken,
        user: expectedUser,
      };

      expect(result.token).toEqual(expectedResponse.token);
      expect(result.user.id).toEqual(expectedResponse.user.id);

      expect(userService.getUser).toHaveBeenCalledWith({
        email: loginUserDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginUserDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
    });
    it('should not login a user with invalid credential(password)', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'wrong test@example.com',
        password: 'wrong password',
      };

      jest.spyOn(userService, 'getUser').mockResolvedValue(null);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        new HttpException('Invalid credentials', 400),
      );
    });
    it('should not login a user with invalid credential(password)', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrong pass',
      };

      jest.spyOn(userService, 'getUser').mockResolvedValue(null);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        new HttpException('Invalid credentials', 400),
      );
    });
  });
});
