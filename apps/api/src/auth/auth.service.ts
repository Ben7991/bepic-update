import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

import { UserRepository } from './repositories/user.repository';
import { LoginDto } from './dto/login.dto';
import { EncryptionService } from './encryption.service';
import { ApplicationException } from '../utils/exception/application.exception';
import { LoginType, Status, TokenType } from './auth.types';
import { AppLogger } from '../utils/logger/app.logger';

@Injectable()
export class AuthService {
  private readonly _logger = new AppLogger(AuthService.name);

  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _encryptionService: EncryptionService,
    private readonly _configService: ConfigService,
  ) {}

  /**
   * Handles user login
   * @param {LoginDto} body - The data provided in the body of the request
   * @returns a user object and tokens
   */
  async login(body: LoginDto): Promise<LoginType> {
    try {
      const existingUser = await this._userRepo.find(body.username);
      const hashedPassword = existingUser ? existingUser.password : '';
      const samePassword = await compare(body.password, hashedPassword);

      if (
        !existingUser ||
        !samePassword ||
        (existingUser && existingUser.status === Status.SUSPENDED)
      ) {
        throw new ApplicationException('Invalid username and or password');
      }

      const encryptedRefreshToken = this._encryptionService.encrypt(
        this._generateRefreshToken(existingUser.id),
      );
      const encryptedAccessToken = this._encryptionService.encrypt(
        this._generateAccessToken(existingUser.id),
      );

      return {
        user: existingUser,
        token: {
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
        },
      };
    } catch (error) {
      if (error instanceof ApplicationException) {
        throw new BadRequestException(error.message);
      }

      this._logger.error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  /**
   * Returns an env variable named `SECRET_KEY` from the
   * env file, if it does exist throw and error
   * @returns the secret key from the env file
   */
  private _getSecretKey(): string {
    const secretKey = this._configService.get<string>('SECRET_KEY');

    if (!secretKey) {
      throw new Error('Secret key does not exist');
    }

    return secretKey;
  }

  /**
   * Generates an access token by using the generated refresh token
   * @param {string} payload - The refresh token
   * @returns a generated access token
   */
  private _generateAccessToken(payload: string): string {
    return sign(
      { sub: payload, type: TokenType.ACCESS_TOKEN },
      this._getSecretKey(),
      {
        algorithm: 'HS256',
        expiresIn: '15m',
      },
    );
  }

  /**
   * Generates a refresh token by using a payload where the sub is the
   * user id
   * @param payload - the user id
   * @returns the refresh token
   */
  private _generateRefreshToken(payload: string): string {
    return sign(
      { sub: payload, type: TokenType.REFRESH_TOKEN },
      this._getSecretKey(),
      {
        algorithm: 'HS256',
        expiresIn: '12h',
      },
    );
  }
}
