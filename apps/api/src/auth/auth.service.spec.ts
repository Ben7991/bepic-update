import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { DataSource, QueryRunner } from 'typeorm';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { EncryptionService } from './encryption.service';
import { LoginDto } from './dto/login.dto';
import { Status, TokenType } from './auth.types';
import { User } from './entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let encryptionService: EncryptionService;
  let configService: ConfigService;
  let dataSource: DataSource;

  const mockedQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  } as unknown as QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            find: () => jest.fn(),
            update: () => jest.fn(),
          },
        },
        {
          provide: EncryptionService,
          useValue: {
            encrypt: () => jest.fn(),
            decrypt: () => jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => mockedQueryRunner,
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => mockedQueryRunner),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    encryptionService = module.get<EncryptionService>(EncryptionService);
    configService = module.get<ConfigService>(ConfigService);
    dataSource = module.get<DataSource>(DataSource);

    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(encryptionService).toBeDefined();
    expect(configService).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  describe('login', () => {
    const mockedLoginDto = {
      username: 'test-username',
      password: 'test-password',
    } as unknown as LoginDto;

    it('should throw if a user does not exist with the provided username', async () => {
      const encryptSpy = jest.spyOn(encryptionService, 'encrypt');
      const compareSpy = jest.spyOn(bcryptjs, 'compare');
      jest.spyOn(userRepository, 'find').mockResolvedValue(null);
      await expect(authService.login(mockedLoginDto)).rejects.toEqual(
        new BadRequestException('Invalid username and or password'),
      );
      expect(compareSpy).toHaveBeenCalled();
      expect(encryptSpy).not.toHaveBeenCalled();
    });

    it('should throw if a user exist but has the suspended status', async () => {
      const mockedUserFromDb = {
        status: Status.SUSPENDED,
      } as unknown as User;
      const compareSpy = jest
        .spyOn(bcryptjs, 'compare')
        .mockResolvedValue(true as unknown as never);
      const encryptSpy = jest.spyOn(encryptionService, 'encrypt');
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockedUserFromDb);
      await expect(authService.login(mockedLoginDto)).rejects.toEqual(
        new BadRequestException('Invalid username and or password'),
      );
      expect(compareSpy).toHaveBeenCalled();
      expect(encryptSpy).not.toHaveBeenCalled();
    });

    it('should throw if the password does match the hashedPassword', async () => {
      const mockedUserFromDb = {
        status: Status.ACTIVE,
      } as unknown as User;
      const compareSpy = jest
        .spyOn(bcryptjs, 'compare')
        .mockResolvedValue(false as unknown as never);
      const encryptSpy = jest.spyOn(encryptionService, 'encrypt');
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockedUserFromDb);
      await expect(authService.login(mockedLoginDto)).rejects.toEqual(
        new BadRequestException('Invalid username and or password'),
      );
      expect(compareSpy).toHaveBeenCalled();
      expect(encryptSpy).not.toHaveBeenCalled();
    });

    it('should throw if the secret key does not exist', async () => {
      const mockedUserFromDb = {
        id: '1234',
        status: Status.ACTIVE,
      } as unknown as User;
      const compareSpy = jest
        .spyOn(bcryptjs, 'compare')
        .mockResolvedValue(true as unknown as never);
      const encryptSpy = jest.spyOn(encryptionService, 'encrypt');
      jest.spyOn(configService, 'get');
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockedUserFromDb);
      await expect(authService.login(mockedLoginDto)).rejects.toEqual(
        new InternalServerErrorException('Something went wrong'),
      );
      expect(compareSpy).toHaveBeenCalled();
      expect(encryptSpy).not.toHaveBeenCalled();
    });

    it('should return the expected value', async () => {
      const mockedUserFromDb = {
        id: '1234',
        name: 'user',
        status: Status.ACTIVE,
      } as unknown as User;
      const mockedResponse = {
        user: mockedUserFromDb,
        token: {
          accessToken: '***',
          refreshToken: '***',
        },
      };
      const compareSpy = jest
        .spyOn(bcryptjs, 'compare')
        .mockResolvedValue(true as unknown as never);
      const signSpy = jest
        .spyOn(jsonwebtoken, 'sign')
        .mockReturnValue('tk' as unknown as never);
      const encryptSpy = jest
        .spyOn(encryptionService, 'encrypt')
        .mockReturnValue('***')
        .mockReturnValue('***');
      jest.spyOn(configService, 'get');
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockedUserFromDb);
      await expect(authService.login(mockedLoginDto)).resolves.toEqual(
        mockedResponse,
      );
      expect(signSpy).toHaveBeenCalled();
      expect(compareSpy).toHaveBeenCalled();
      expect(encryptSpy).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    const mockedToken = 'abcd';
    const mockedDecryptedToken = 'abcd-12345';
    const mockedSecretKey = 'secret-key';

    it('should throw if the token is undefined', async () => {
      const decryptSpy = jest.spyOn(encryptionService, 'decrypt');
      await expect(authService.refreshToken()).rejects.toThrow(
        UnauthorizedException,
      );
      expect(decryptSpy).not.toHaveBeenCalled();
    });

    it('should throw if the token type is not a refresh token', async () => {
      const decryptSpy = jest
        .spyOn(encryptionService, 'decrypt')
        .mockReturnValue(mockedDecryptedToken);
      const verifySpy = jest
        .spyOn(jsonwebtoken, 'verify')
        .mockReturnValue({ sub: '1234', type: 'tk' } as unknown as never);
      const findSpy = jest.spyOn(userRepository, 'find');
      const configSpy = jest
        .spyOn(configService, 'get')
        .mockImplementation((token) => {
          switch (token) {
            case 'SECRET_KEY':
              return mockedSecretKey;
            default:
              return '';
          }
        });

      await expect(authService.refreshToken(mockedToken)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(decryptSpy).toHaveBeenCalled();
      expect(configSpy).toHaveBeenCalled();
      expect(verifySpy).toHaveBeenCalled();
      expect(verifySpy).toHaveBeenCalledWith(
        mockedDecryptedToken,
        mockedSecretKey,
        {
          algorithms: ['HS256'],
        },
      );
      expect(findSpy).not.toHaveBeenCalled();
    });

    it('should throw if user does not exist', async () => {
      const decryptSpy = jest
        .spyOn(encryptionService, 'decrypt')
        .mockReturnValue(mockedDecryptedToken);
      const verifySpy = jest.spyOn(jsonwebtoken, 'verify').mockReturnValue({
        sub: '1234',
        type: String(TokenType.REFRESH_TOKEN),
      } as unknown as never);
      const findSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(null);
      const configSpy = jest
        .spyOn(configService, 'get')
        .mockImplementation((token) => {
          switch (token) {
            case 'SECRET_KEY':
              return mockedSecretKey;
            default:
              return '';
          }
        });

      await expect(authService.refreshToken(mockedToken)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(decryptSpy).toHaveBeenCalled();
      expect(configSpy).toHaveBeenCalled();
      expect(verifySpy).toHaveBeenCalled();
      expect(findSpy).toHaveBeenCalled();
    });

    it('should throw if there an uncontrolled unexpected failure', async () => {
      const decryptSpy = jest
        .spyOn(encryptionService, 'decrypt')
        .mockReturnValue(mockedDecryptedToken);
      const verifySpy = jest
        .spyOn(jsonwebtoken, 'verify')
        .mockImplementation(() => {
          throw new Error('can not verify');
        });
      const findSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(null);
      const configSpy = jest
        .spyOn(configService, 'get')
        .mockImplementation((token) => {
          switch (token) {
            case 'SECRET_KEY':
              return mockedSecretKey;
            default:
              return '';
          }
        });

      await expect(authService.refreshToken(mockedToken)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(decryptSpy).toHaveBeenCalled();
      expect(configSpy).toHaveBeenCalled();
      expect(verifySpy).toHaveBeenCalled();
      expect(findSpy).not.toHaveBeenCalled();
    });

    it('should return a new access token', async () => {
      const mockedUser = {
        id: '1234',
        name: 'user',
      } as unknown as User;

      const decryptSpy = jest
        .spyOn(encryptionService, 'decrypt')
        .mockReturnValue(mockedDecryptedToken);
      const verifySpy = jest.spyOn(jsonwebtoken, 'verify').mockReturnValue({
        sub: '1234',
        type: String(TokenType.REFRESH_TOKEN),
      } as unknown as never);
      const signSpy = jest.spyOn(jsonwebtoken, 'sign');
      const findSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(mockedUser);
      const configSpy = jest
        .spyOn(configService, 'get')
        .mockImplementation((token) => {
          switch (token) {
            case 'SECRET_KEY':
              return mockedSecretKey;
            default:
              return '';
          }
        });

      await expect(
        authService.refreshToken(mockedToken),
      ).resolves.toBeDefined();
      expect(decryptSpy).toHaveBeenCalled();
      expect(configSpy).toHaveBeenCalled();
      expect(verifySpy).toHaveBeenCalled();
      expect(findSpy).toHaveBeenCalled();
      expect(signSpy).toHaveBeenCalled();
    });
  });

  describe('changePersonalInfo', () => {
    const mockedUser = {
      id: '12345',
      name: 'user',
    } as unknown as User;
    const mockedPersonalInfo = {
      name: mockedUser.name,
    };

    it('should return a message after successful update', async () => {
      jest.spyOn(userRepository, 'update').mockResolvedValue(mockedUser);
      await expect(
        authService.changePersonalInfo(mockedPersonalInfo, mockedUser),
      ).resolves.toEqual({
        message: 'Personal information changed successfully',
      });
    });

    it('should throw if there is a failure with the update function', async () => {
      jest.spyOn(userRepository, 'update').mockImplementation(() => {
        throw new Error('Cannot update user details');
      });
      await expect(
        authService.changePersonalInfo(mockedPersonalInfo, mockedUser),
      ).rejects.toThrow();
    });
  });
});
