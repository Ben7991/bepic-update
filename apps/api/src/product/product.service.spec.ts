import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { ProductService } from './product.service';
import { mockedQueryRunner } from '../utils/mocks.utils';
import { ProductRepository } from './repositories/product.repository';
import { Paginator } from '../utils/paginator/paginator';
import { InternalServerErrorException } from '@nestjs/common';

const mockedPaginator = {
  query: '',
  page: 0,
  perPage: 10,
} as Paginator;

const mockedProducts = [
  {
    id: 7,
    createdAt: new Date('2026-09-29T19:46:40.160Z'),
    updatedAt: new Date('2026-09-29T19:46:40.160Z'),
    name: 'Lokus tea',
    image: 'uploads/products/1790711200155-143621489.jpg',
    price: 120,
    point: 50,
  },
];

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: ProductRepository;
  let dataSource: DataSource;
  let loggerError: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => mockedQueryRunner),
          },
        },
        {
          provide: ProductRepository,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            paginate: jest.fn(),
          },
        },
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    service = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);

    loggerError = jest.fn();
    Object.defineProperty(service, '_logger', {
      value: {
        error: loggerError,
      },
      writable: true,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(dataSource).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('paginate', () => {
    it('should return the expected paginated result', async () => {
      jest.spyOn(productRepository, 'count').mockResolvedValue(1);
      jest
        .spyOn(productRepository, 'paginate')
        .mockResolvedValue(mockedProducts);
      await expect(service.paginate(mockedPaginator)).resolves.toEqual({
        count: 1,
        data: mockedProducts,
      });
    });

    it('should throw if count encounters an error', async () => {
      jest
        .spyOn(productRepository, 'count')
        .mockRejectedValue(new Error('Something went wrong'));
      jest
        .spyOn(productRepository, 'paginate')
        .mockResolvedValue(mockedProducts);
      await expect(service.paginate(mockedPaginator)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw if paginate encounters an error', async () => {
      jest.spyOn(productRepository, 'count').mockResolvedValue(1);
      jest
        .spyOn(productRepository, 'paginate')
        .mockRejectedValue(new Error('Something went wrong'));
      await expect(service.paginate(mockedPaginator)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
