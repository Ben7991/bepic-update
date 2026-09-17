import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, SelectQueryBuilder } from 'typeorm';

import { Product } from '../entities/product.entity';

/**
 * Handles all communication to the `products` table in the database
 */
@Injectable()
export class ProductRepository {
  constructor(private readonly _dataSource: DataSource) {}

  /**
   * Returns a queryBuilder for communicating to the `products` table
   * @returns a product queryBuilder
   */
  private _createQueryBuilder(): SelectQueryBuilder<Product> {
    return this._dataSource.createQueryBuilder(Product, 'products');
  }

  /**
   * Adds a new product row in the `products` table
   * @param queryRunner
   * @param data
   * @returns an product representing a row in the products table
   */
  create(
    queryRunner: QueryRunner,
    data: Pick<Product, 'name' | 'point' | 'image' | 'price'>,
  ) {
    const product = new Product();
    product.name = data.name;
    product.point = data.point;
    product.image = data.image;
    product.price = data.price;
    return queryRunner.manager.save(product);
  }

  /**
   * Retrieves an product object from the `products` table or null
   * if the provided data isn't mapped to any column in the table
   * @param {string} data
   * @returns a product object or null
   */
  find(data: number | string): Promise<Product | null> {
    return this._createQueryBuilder()
      .where('name=:data')
      .orWhere('id=:data')
      .setParameters({ data })
      .getOne();
  }
}
