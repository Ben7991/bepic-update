import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { describe, beforeEach, it, jest, expect } from '@jest/globals';

import { SeederService } from './seeder.service';
import { UserRepository } from '../auth/repositories/user.repository';
import { User } from '../auth/entities/user.entity';

jest.mock('bcryptjs', () => ({
  genSalt: () => jest.fn(),
  hash: () => jest.fn(),
}));

const mockedUser = {
  id: 'AD12345',
  name: 'Admin',
  username: 'username',
  password: 'test-password',
  status: 'ACTIVE',
  role: 'ADMIN',
} as unknown as User;

const queryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
};

describe('SeederService', () => {
  let seederService: SeederService;
  let userRepository: UserRepository;
  let configService: ConfigService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => queryRunner),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            create: () => jest.fn(),
            find: () => jest.fn(),
          },
        },
        SeederService,
      ],
    }).compile();

    seederService = module.get<SeederService>(SeederService);
    userRepository = module.get<UserRepository>(UserRepository);
    configService = module.get<ConfigService>(ConfigService);
    dataSource = module.get<DataSource>(DataSource);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seederService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(configService).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  describe('createAdmin', () => {
    it('should return a user with admin role', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'SALT_ROUNDS':
            return '10';
          case 'ADMIN_PASSWORD':
            return 'test-password';
          case 'ADMIN_NAME':
            return 'Admin';
          case 'ADMIN_USERNAME':
            return 'username';
          default:
            return '';
        }
      });
      jest.spyOn(userRepository, 'find').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockResolvedValue(mockedUser);

      const result = await seederService.createAdmin();
      expect(result).toEqual({ message: 'Admin successfully added' });
    });

    it('should throw if the admin already exist', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'SALT_ROUNDS':
            return '10';
          case 'ADMIN_PASSWORD':
            return 'test-password';
          case 'ADMIN_NAME':
            return 'Admin';
          case 'ADMIN_USERNAME':
            return 'username';
          default:
            return '';
        }
      });
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockedUser);
      const createSpy = jest.spyOn(userRepository, 'create');
      const commitTransactionSpy = jest.spyOn(queryRunner, 'commitTransaction');

      await expect(seederService.createAdmin()).rejects.toEqual(
        new InternalServerErrorException('Admin already exist'),
      );
      expect(createSpy).not.toHaveBeenCalled();
      expect(commitTransactionSpy).not.toHaveBeenCalled();
    });

    it('should throw if salt round does not exist', async () => {
      jest.spyOn(configService, 'get');
      const findSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(mockedUser);
      const createSpy = jest.spyOn(userRepository, 'create');
      const commitTransactionSpy = jest.spyOn(queryRunner, 'commitTransaction');

      await expect(seederService.createAdmin()).rejects.toEqual(
        new Error('Please provide missing salt rounds'),
      );
      expect(createSpy).not.toHaveBeenCalled();
      expect(commitTransactionSpy).not.toHaveBeenCalled();
      expect(findSpy).not.toHaveBeenCalled();
    });
  });
});
