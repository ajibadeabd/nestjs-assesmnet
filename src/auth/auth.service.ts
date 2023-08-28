import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginUserDto } from './types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDataFactory } from '../databaseFactory/user.factory';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private userDataFactory: UserDataFactory,
  ) {}

  // Register a new user
  async register(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10); // Hash the password before saving
      const newUser = await this.userDataFactory.createUser(createUserDto); // Create user using the factory

      return newUser; // Return the created user
    } catch (error) {
      if (error.code === '23505') {
        // Check for duplicate email error
        throw new HttpException('A user with this email already exists', 400);
      }
      throw new HttpException('Error occurred while creating an account', 400);
    }
  }

  // User login
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.getUser({ email: loginUserDto.email }); // Find user by email
    if (!user) throw new HttpException('Invalid credentials', 404); // Throw error if user not found

    // Compare passwords
    const passwordsMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordsMatch) {
      throw new HttpException('Invalid credentials', 400); // Throw error if passwords don't match
    }

    delete user.password; // Remove password from the returned user object
    const payload = { id: user.id, email: user.email };

    // Create a token
    const token = this.jwtService.sign(payload);

    return {
      token,
      user,
    };
  }
}
