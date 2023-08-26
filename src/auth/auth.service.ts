import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginUserDto } from './types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.userService.createUser(createUserDto);
      return newUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException('A user with this email already exist', 400);
      }
      throw new HttpException('Error occur while creating an account', 400);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.getUser(['email', loginUserDto.email]);
    if (!user) throw new HttpException('Invalid credentials', 404);
    const validPassword = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!validPassword) throw new HttpException('Invalid credentials', 404);

    console.log(user);
    // Create a token

    // Implement your login logic here
    // Return authentication tokens or user information
  }
}
