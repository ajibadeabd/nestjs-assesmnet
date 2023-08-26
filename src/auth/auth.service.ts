import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginUserDto } from './types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDataFactory } from '../databaseFactory/user.factory';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userDataFactory: UserDataFactory,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.userDataFactory.createUser(createUserDto);

      return newUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException('A user with this email already exist', 400);
      }
      throw new HttpException('Error occur while creating an account', 400);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.getUser({ email: loginUserDto.email });
    if (!user) throw new HttpException('Invalid credentials', 404);
    // Compare passwords
    const passwordsMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!passwordsMatch) {
      throw new HttpException('Invalid credentials', 400);
    }
    delete user.password;
    console.log(user);
    const payload = { id: user, email: user.email };

    // Create a token
    const token = this.jwtService.sign(payload);
    return {
      token,
      user,
    };
  }
}
