import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the request body for the login
 * route handler in AuthController
 */
export class LoginDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Username is required',
  })
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Password is required',
  })
  @IsString()
  password: string;
}
