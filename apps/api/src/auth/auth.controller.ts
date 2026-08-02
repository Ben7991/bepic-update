import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { DataMessageInterceptor } from '../utils/interceptors/data-message.interceptor';
import {
  swaggerGetAuthenticatedUserResponse,
  swaggerLoginResponse,
} from './auth.swagger';
import { TokenType } from './auth.types';
import { AuthGuard } from './guards/auth.guard';
import { DataOnlyInterceptor } from '../utils/interceptors/data-only.interceptor';

/**
 * Handles all user authentication request
 */
@Controller('auth')
export class AuthController {
  private readonly _refreshTokenDuration = 60 * 60 * 12 * 1000;
  private readonly _accessTokenDuration = 60 * 15 * 1000;

  constructor(
    private readonly _authService: AuthService,
    private readonly _configService: ConfigService,
  ) {}

  /**
   * Set the access token in the cookies of the response
   * @param {Response} res
   * @param {string} accessToken
   * @param {number} duration
   */
  private _setAccessTokenInCookie(
    res: Response,
    accessToken?: string,
    duration?: number,
  ): void {
    res.cookie(TokenType.ACCESS_TOKEN, accessToken ?? '', {
      path: '/',
      maxAge: duration ?? 0,
      domain: this._configService.get('domain'),
    });
  }

  /**
   * Set the refresh token in the cookies of the response
   * @param {Response} res
   * @param {string} refreshToken
   * @param {number} duration
   */
  private _setRefreshTokenInCookie(
    res: Response,
    refreshToken?: string,
    duration?: number,
  ): void {
    res.cookie(TokenType.REFRESH_TOKEN, refreshToken ?? '', {
      path: '/',
      httpOnly: true,
      maxAge: duration ?? 0,
      domain: this._configService.get('DOMAIN'),
      sameSite: this._configService.get('SAME_SITE'),
    });
  }

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
  async login(
    @Body(ValidationPipe) body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._authService.login(body);

    this._setRefreshTokenInCookie(
      res,
      result.token.refreshToken,
      this._refreshTokenDuration,
    );
    this._setAccessTokenInCookie(
      res,
      result.token.accessToken,
      this._accessTokenDuration,
    );

    return result.user;
  }

  /**
   * Clears token in users cookies as well as
   * return a logout success message
   * @param {Request} req
   * @param {Response} res
   * @returns a logout message
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OK',
    example: {
      message: 'Successfully logged out of the application',
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this._setRefreshTokenInCookie(res);
    this._setAccessTokenInCookie(res);

    return { message: 'Successfully logged out of the application' };
  }

  /**
   * Returns the authenticated user using the refresh token
   * @param {Request} req
   * @returns properties of authenticated user
   */
  @ApiOperation(swaggerGetAuthenticatedUserResponse)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(DataOnlyInterceptor)
  @Get('user')
  getAuthenticatedUser(@Req() req: Request) {
    return req.user;
  }
}
