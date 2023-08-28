import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger'; // Import swagger annotations
import { HttpResponse } from '../../src/util'; // Assuming this is your custom utility for HTTP responses
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './types';
import { Response } from 'express';

@ApiTags('auth') // Tag the controller with 'auth' for Swagger documentation
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // API endpoint to register a user
  @ApiResponse({ status: 201, description: 'User created successfully' }) // Add Swagger response annotation
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto, // Use CreateUserDto for input validation
    @Res() response: Response,
  ) {
    const result = await this.authService.register(createUserDto); // Call the register method in AuthService
    return HttpResponse.created(response, result, 'User created successfully'); // Return a created response with custom message
  }

  // API endpoint to log in a user
  @ApiResponse({ status: 200, description: 'User login successful' }) // Add Swagger response annotation
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    const result = await this.authService.login(loginUserDto); // Call the login method in AuthService
    return HttpResponse.ok(response, result, 'User login successful'); // Return an OK response with custom message
  }
}
