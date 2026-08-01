import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { DataMessageInterceptor } from '../utils/interceptors/data-message.interceptor';
import { swaggerLoginResponse } from './auth.swagger';

/**
 * Handles all user authentication request
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  /**
   * Handles incoming login request
   * @param {LoginDto} body - an object from the request body
   * @returns the authenticated info for a user
   */
  @ApiOperation(swaggerLoginResponse)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('You are logged-in successfully'))
  @Post('login')
  login(@Body(ValidationPipe) body: LoginDto) {
    return this._authService.login(body);
  }
}
