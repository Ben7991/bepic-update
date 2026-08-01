import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { EncryptionService } from './encryption.service';
import { LoginDto } from './dto/login.dto';
import { Status } from './auth.types';
import { User } from './entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let encryptionService: EncryptionService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    encryptionService = module.get<EncryptionService>(EncryptionService);
    configService = module.get<ConfigService>(ConfigService);

    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(encryptionService).toBeDefined();
    expect(configService).toBeDefined();
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
});
