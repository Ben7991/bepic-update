import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { ProductService } from './product.service';
import { mockedQueryRunner } from '../utils/mocks.utils';
import { ProductRepository } from './repositories/product.repository';

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
});
