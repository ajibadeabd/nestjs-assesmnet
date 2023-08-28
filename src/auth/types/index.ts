import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

// create-user.dto.ts
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: 'secretpassword' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}

// login-user.dto.ts
export class LoginUserDto {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: 'secretpassword' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
