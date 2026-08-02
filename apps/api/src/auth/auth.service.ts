import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

import { UserRepository } from './repositories/user.repository';
import { LoginDto } from './dto/login.dto';
import { EncryptionService } from './encryption.service';
import { ApplicationException } from '../utils/exception/application.exception';
import { LoginType, Status, TokenType } from './auth.types';
import { AppLogger } from '../utils/logger/app.logger';
import { ChangePersonalDto } from './dto/change-personal.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly _logger = new AppLogger(AuthService.name);

  constructor(
    private readonly _dataSource: DataSource,
    private readonly _userRepo: UserRepository,
    private readonly _configService: ConfigService,
    private readonly _encryptionService: EncryptionService,
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

  /**
   * Generate a new access token for the user
   * @param {string} token - The refresh token provided during the request
   * @returns a new generated access token
   */
  async refreshToken(token?: string): Promise<string> {
    try {
      if (!token) {
        throw new ApplicationException('Access denied');
      }

      const decryptedToken = this._encryptionService.decrypt(token);
      const result = verify(decryptedToken, this._getSecretKey(), {
        algorithms: ['HS256'],
      }) as unknown as { sub: string; type: string };

      if (result.type !== String(TokenType.REFRESH_TOKEN))
        throw new ApplicationException('Access denied');

      const existingUser = await this._userRepo.find(result.sub);

      if (!existingUser) throw new ApplicationException('Access denied');

      return this._encryptionService.encrypt(
        this._generateAccessToken(existingUser.id),
      );
    } catch (error) {
      if (error instanceof ApplicationException)
        throw new UnauthorizedException(error.message);

      this._logger.error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  /**
   * Change name of a user
   * @param {ChangePersonalDto} body
   * @param {User} user
   * @returns
   */
  async changePersonalInfo(
    body: ChangePersonalDto,
    user: User,
  ): Promise<{ message: string }> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this._userRepo.update(queryRunner, user, {
        name: body.name,
        password: user.password,
        status: user.status,
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { message: 'Personal information changed successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this._logger.error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
