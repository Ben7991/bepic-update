import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { IncentiveService } from './incentive.service';
import { IncentiveRepository } from './repositories/incentive.repository';
import { mockedQueryRunner } from '../utils/mocks.utils';
import { ItemAvailabilityStatus } from '../utils/types.utils';
import { Paginator } from '../utils/paginator/paginator';
import { Incentive } from './entities/incentive.entity';

const mockedIncentiveDto = {
  point: 10,
  award: 'First award',
};

const mockedIncentive = {
  id: 1,
  point: 5,
  award: 'First award',
} as Incentive;

describe('IncentiveService', () => {
  let incentiveService: IncentiveService;
  let incentiveRepository: IncentiveRepository;
  let dataSource: DataSource;
  let loggerError: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncentiveService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => mockedQueryRunner),
          },
        },
        {
          provide: IncentiveRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
            paginate: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    incentiveService = module.get<IncentiveService>(IncentiveService);
    dataSource = module.get<DataSource>(DataSource);
    incentiveRepository = module.get<IncentiveRepository>(IncentiveRepository);

    loggerError = jest.fn();
    Object.defineProperty(incentiveService, '_logger', {
      value: {
        error: loggerError,
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(dataSource).toBeDefined();
    expect(incentiveService).toBeDefined();
    expect(incentiveRepository).toBeDefined();
  });

  describe('paginate', () => {
    const mockedPaginator = {
      query: '',
      page: 0,
      perPage: 10,
    } as Paginator;

    it('should return the paginated result', async () => {
      const mockedIncentives = [
        {
          id: 1,
          point: 10,
          award: 'Electronic',
          status: ItemAvailabilityStatus.ACTIVE,
          createdAt: new Date('2026-08-28T09:13:38.450Z'),
          updatedAt: new Date('2026-08-28T09:13:38.450Z'),
        },
      ];
      jest.spyOn(incentiveRepository, 'count').mockResolvedValue(1);
      jest
        .spyOn(incentiveRepository, 'paginate')
        .mockResolvedValue(mockedIncentives);
      await expect(incentiveService.paginate(mockedPaginator)).resolves.toEqual(
        { count: 1, activeIncentives: 1, data: mockedIncentives },
      );
    });

    it('should throw if either count or paginate throws', async () => {
      jest.spyOn(incentiveRepository, 'count').mockResolvedValue(1);
      jest
        .spyOn(incentiveRepository, 'paginate')
        .mockRejectedValue(new Error());
      await expect(
        incentiveService.paginate(mockedPaginator),
      ).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should throw if incentive already exist with such point', async () => {
      const findSpy = jest
        .spyOn(incentiveRepository, 'find')
        .mockResolvedValueOnce(mockedIncentive)
        .mockResolvedValueOnce(null);
      const createSpy = jest.spyOn(incentiveRepository, 'create');
      await expect(incentiveService.create(mockedIncentiveDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(findSpy).toHaveBeenCalledTimes(2);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should throw if incentive already exist with such award', async () => {
      const findSpy = jest
        .spyOn(incentiveRepository, 'find')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockedIncentive);
      const createSpy = jest.spyOn(incentiveRepository, 'create');
      await expect(incentiveService.create(mockedIncentiveDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(findSpy).toHaveBeenCalledTimes(2);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should resolve if no duplicate exist', async () => {
      const findSpy = jest
        .spyOn(incentiveRepository, 'find')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      const createSpy = jest
        .spyOn(incentiveRepository, 'create')
        .mockResolvedValueOnce(mockedIncentive);
      await expect(
        incentiveService.create(mockedIncentiveDto),
      ).resolves.toEqual(mockedIncentive);
      expect(findSpy).toHaveBeenCalledTimes(2);
      expect(createSpy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should throw if no incentive can be found with the provided id', async () => {
      const id = 1;
      const findSpy = jest
        .spyOn(incentiveRepository, 'find')
        .mockResolvedValueOnce(null);
      const updateSpy = jest.spyOn(incentiveRepository, 'update');
      await expect(
        incentiveService.update(mockedIncentiveDto, id),
      ).rejects.toThrow(BadRequestException);
      expect(findSpy).toHaveBeenCalled();
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should update when incentive exist', async () => {
      const id = 1;
      const findSpy = jest
        .spyOn(incentiveRepository, 'find')
        .mockResolvedValueOnce(mockedIncentive);
      const updateSpy = jest
        .spyOn(incentiveRepository, 'update')
        .mockResolvedValueOnce(mockedIncentive);
      await expect(
        incentiveService.update(mockedIncentiveDto, id),
      ).resolves.toBeDefined();
      expect(findSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalled();
    });

    it('should throw if update throws', async () => {
      const id = 1;
      const findSpy = jest
        .spyOn(incentiveRepository, 'find')
        .mockResolvedValueOnce(mockedIncentive);
      const updateSpy = jest
        .spyOn(incentiveRepository, 'update')
        .mockRejectedValueOnce(new Error('Failed'));
      await expect(
        incentiveService.update(mockedIncentiveDto, id),
      ).rejects.toThrow(InternalServerErrorException);
      expect(findSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should throw if no incentive exist', async () => {
      const id = 1;
      const findSpy = jest
        .spyOn(incentiveRepository, 'find')
        .mockResolvedValueOnce(null);
      const updateSpy = jest.spyOn(incentiveRepository, 'update');
      await expect(incentiveService.destroy(id)).rejects.toThrow(
        BadRequestException,
      );
      expect(findSpy).toHaveBeenCalled();
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should update record if incentive exist', async () => {
      const id = 1;
      const findSpy = jest
        .spyOn(incentiveRepository, 'find')
        .mockResolvedValueOnce(mockedIncentive);
      jest.spyOn(incentiveRepository, 'update');
      await expect(incentiveService.destroy(id)).resolves.toBeDefined();
      expect(findSpy).toHaveBeenCalled();
    });

    it('should throw if update encounters an error', async () => {
      const id = 1;
      const findSpy = jest
        .spyOn(incentiveRepository, 'find')
        .mockResolvedValueOnce(mockedIncentive);
      jest
        .spyOn(incentiveRepository, 'update')
        .mockRejectedValue(new Error('Update failed'));
      await expect(incentiveService.destroy(id)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(findSpy).toHaveBeenCalled();
    });
  });
});
