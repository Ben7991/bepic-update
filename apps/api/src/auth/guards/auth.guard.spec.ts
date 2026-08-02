import { describe, beforeEach, jest, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jsonwebtoken from 'jsonwebtoken';

import { AuthGuard } from './auth.guard';
import { UserRepository } from '../repositories/user.repository';
import { EncryptionService } from '../encryption.service';
import { User } from '../entities/user.entity';
import { TokenType } from '../auth.types';

const mockedToken = 'acc-tk';
const mockedDecryptedToken = `***${mockedToken}***`;
const mockedSecretKey = 'secret-key';
const mockedVerifyResult = { sub: '12345', type: TokenType.ACCESS_TOKEN };
const mockedUser = {
  id: '12345',
  name: 'user',
  role: 'ADMIN',
} as unknown as User;
const mockedContextWithAuthorization = {
  switchToHttp: () => ({
    getRequest: () => ({
      headers: { authorization: `Bearer ${mockedToken}` },
    }),
  }),
} as unknown as ExecutionContext;

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let userRepository: UserRepository;
  let encryptionService: EncryptionService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: UserRepository,
          useValue: {
            find: () => jest.fn(),
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
            get: () => jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    userRepository = module.get<UserRepository>(UserRepository);
    encryptionService = module.get<EncryptionService>(EncryptionService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(encryptionService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('canActivate', () => {
    it('should throw if the authorization token is not set', async () => {
      const contextWithoutAuthorization = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: {} }),
        }),
      } as unknown as ExecutionContext;

      const contextWithOnlyTokenInAuthorization = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: 'Bearer' } }),
        }),
      } as unknown as ExecutionContext;

      const contextWithWrongBearerInAuthorization = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: 'url' } }),
        }),
      } as unknown as ExecutionContext;

      await expect(
        authGuard.canActivate(contextWithoutAuthorization),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        authGuard.canActivate(contextWithOnlyTokenInAuthorization),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        authGuard.canActivate(contextWithWrongBearerInAuthorization),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if type of token is undefined', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'SECRET_KEY':
            return 'secret-key';
          default:
            return '';
        }
      });
      const decryptSpy = jest
        .spyOn(encryptionService, 'decrypt')
        .mockReturnValue(mockedDecryptedToken);
      const verifySpy = jest
        .spyOn(jsonwebtoken, 'verify')
        .mockReturnValue({ sub: '12345' } as unknown as never);
      const findSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(null);

      await expect(
        authGuard.canActivate(mockedContextWithAuthorization),
      ).rejects.toThrow(UnauthorizedException);
      expect(decryptSpy).toHaveBeenCalledWith(mockedToken);
      expect(verifySpy).toHaveBeenCalledWith(
        mockedDecryptedToken,
        mockedSecretKey,
        {
          algorithms: ['HS256'],
        },
      );
      expect(findSpy).not.toHaveBeenCalled();
    });

    it('should throw if type of token type does match expected value', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'SECRET_KEY':
            return 'secret-key';
          default:
            return '';
        }
      });
      const decryptSpy = jest
        .spyOn(encryptionService, 'decrypt')
        .mockReturnValue(mockedDecryptedToken);
      const verifySpy = jest
        .spyOn(jsonwebtoken, 'verify')
        .mockReturnValue({ sub: '12345', type: '_ref-tk' } as unknown as never);
      const findSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(null);

      await expect(
        authGuard.canActivate(mockedContextWithAuthorization),
      ).rejects.toThrow(UnauthorizedException);
      expect(decryptSpy).toHaveBeenCalledWith(mockedToken);
      expect(verifySpy).toHaveBeenCalledWith(
        mockedDecryptedToken,
        mockedSecretKey,
        {
          algorithms: ['HS256'],
        },
      );
      expect(findSpy).not.toHaveBeenCalled();
    });

    it('should throw if the user is not found', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'SECRET_KEY':
            return 'secret-key';
          default:
            return '';
        }
      });
      const decryptSpy = jest
        .spyOn(encryptionService, 'decrypt')
        .mockReturnValue(mockedDecryptedToken);
      const verifySpy = jest
        .spyOn(jsonwebtoken, 'verify')
        .mockReturnValue(mockedVerifyResult as unknown as never);
      const findSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(null);

      await expect(
        authGuard.canActivate(mockedContextWithAuthorization),
      ).rejects.toThrow(UnauthorizedException);
      expect(decryptSpy).toHaveBeenCalledWith(mockedToken);
      expect(verifySpy).toHaveBeenCalledWith(
        mockedDecryptedToken,
        mockedSecretKey,
        {
          algorithms: ['HS256'],
        },
      );
      expect(verifySpy).toHaveReturnedWith(mockedVerifyResult);
      expect(findSpy).toHaveBeenCalled();
      expect(findSpy).toHaveBeenCalledWith('12345');
    });

    it('should return true if all checks turns out right', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'SECRET_KEY':
            return mockedSecretKey;
          default:
            return '';
        }
      });
      const decryptSpy = jest
        .spyOn(encryptionService, 'decrypt')
        .mockReturnValue(mockedDecryptedToken);
      const verifySpy = jest
        .spyOn(jsonwebtoken, 'verify')
        .mockReturnValue(mockedVerifyResult as unknown as never);
      const findSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(mockedUser);

      await expect(
        authGuard.canActivate(mockedContextWithAuthorization),
      ).resolves.toBeTruthy();
      expect(decryptSpy).toHaveBeenCalledWith(mockedToken);
      expect(verifySpy).toHaveBeenCalledWith(
        mockedDecryptedToken,
        mockedSecretKey,
        {
          algorithms: ['HS256'],
        },
      );
      expect(verifySpy).toHaveReturnedWith(mockedVerifyResult);
      expect(findSpy).toHaveBeenCalledWith('12345');
    });
  });
});
