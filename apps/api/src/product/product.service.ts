import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { extname, join } from 'node:path';
import { writeFile } from 'node:fs/promises';

import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { AppLogger } from '../utils/logger/app.logger';
import { ProductRepository } from './repositories/product.repository';
import { ApplicationException } from '../utils/exception/application.exception';
import { Paginator } from '../utils/paginator/paginator';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private readonly _logger = new AppLogger(ProductService.name);

  constructor(
    private readonly _dataSource: DataSource,
    private readonly _productRepository: ProductRepository,
  ) {}

  /**
   * Handles the pagination of products data
   * @param {Paginator} paginator
   * @returns an object containing, count and an array of products as data
   */
  async paginate(paginator: Paginator) {
    try {
      const [count, data] = await Promise.all([
        this._productRepository.count(paginator.query),
        this._productRepository.paginate(paginator),
      ]);
      return { count, data };
    } catch (error) {
      this._logger.error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  /**
   * Handles addition of new products details in the file system
   * and the database. It as well ensures that no duplicate product
   * details are ever entered into the database
   *
   * @param body the request body excluding the uploaded file
   * @param file the uploaded product image
   * @returns
   */
  async create(
    body: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingProductByName = await this._productRepository.find(
        body.name,
      );

      if (existingProductByName)
        throw new ApplicationException(
          'No duplicate product names are allowed',
        );

      const imagePath = await this._uploadFile(file);
      const product = await this._productRepository.create(queryRunner, {
        name: body.name,
        point: +body.point,
        price: +body.price,
        image: imagePath,
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      if (error instanceof ApplicationException)
        throw new BadRequestException(error.message);

      this._logger.error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  /**
   * Uploads the product image into the file system
   * @param file the product image
   * @returns a generated directory path of the uploaded image
   */
  private async _uploadFile(file: Express.Multer.File): Promise<string> {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;

    const uploadPath = join(process.cwd(), 'uploads', 'products', filename);
    await writeFile(uploadPath, file.buffer);

    return `uploads/products/${filename}`;
  }

  /**
   * Handles product data update
   * @param body - the request body
   * @param id - the id of the product to update
   * @returns an update product data
   */
  async update(body: UpdateProductDto, id: number): Promise<Product> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingProduct = await this._productRepository.find(id);

      if (!existingProduct)
        throw new ApplicationException('No product with such id exist');

      const product = await this._productRepository.update(
        queryRunner,
        existingProduct,
        body,
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      if (error instanceof ApplicationException)
        throw new BadRequestException(error.message);

      this._logger.error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
