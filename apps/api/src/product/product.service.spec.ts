import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { mockedQueryRunner } from '../utils/mocks.utils';
import { ProductRepository } from './repositories/product.repository';
import { Paginator } from '../utils/paginator/paginator';
import { Product } from './entities/product.entity';

jest.mock('node:path');
jest.mock('node:fs/promises');

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
const mockedFile = {
  originalname: 'image-1.jpg',
  buffer: Buffer.from([1, 2, 3]),
} as unknown as Express.Multer.File;
const mockedCreateProductDto = {
  name: 'Product',
  price: 150,
  point: 20,
};

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

    jest.clearAllMocks();
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

  describe('create', () => {
    it('should return a newly created product', async () => {
      const mockedProduct = {
        id: 1,
        ...mockedCreateProductDto,
        image: 'image-1.jpg',
      } as unknown as Product;
      const findSpy = jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue(null);
      jest.spyOn(productRepository, 'create').mockResolvedValue(mockedProduct);
      await expect(
        service.create(mockedCreateProductDto, mockedFile),
      ).resolves.toEqual(mockedProduct);
      expect(findSpy).toHaveBeenCalledWith(mockedCreateProductDto.name);
    });

    it('should throw if find return an existing product', async () => {
      const mockedProduct = {
        id: 1,
        ...mockedCreateProductDto,
        image: 'image-1.jpg',
      } as unknown as Product;
      jest.spyOn(productRepository, 'find').mockResolvedValue(mockedProduct);
      const createSpy = jest.spyOn(productRepository, 'create');
      await expect(
        service.create(mockedCreateProductDto, mockedFile),
      ).rejects.toThrow(BadRequestException);
      expect(createSpy).not.toHaveBeenCalled();
    });
  });
});
