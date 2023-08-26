import { Controller, Post, Body, Res } from '@nestjs/common';
import { HttpResponse } from '../../src/util';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './types';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const result = await this.authService.register(createUserDto);
    return HttpResponse.created(response, result, 'User created successfully');
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    const result = await this.authService.login(loginUserDto);
    return HttpResponse.ok(response, result, 'User created successfully');
  }
}
