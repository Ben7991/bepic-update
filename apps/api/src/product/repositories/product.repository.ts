import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, SelectQueryBuilder } from 'typeorm';

import { Product } from '../entities/product.entity';
import { Paginator } from '../../utils/paginator/paginator';

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
   * Updates existing product in the `products` table
   * @param queryRunner
   * @param product
   * @param data
   * @returns an product representing a row in the products table
   */
  async update(
    queryRunner: QueryRunner,
    product: Product,
    data: Partial<Pick<Product, 'name' | 'point' | 'image' | 'price'>>,
  ): Promise<Product> {
    product.name = data.name ?? product.name;
    product.point = data.point ?? product.point;
    product.price = data.price ?? product.price;
    product.image = data.image ?? product.image;
    return await queryRunner.manager.save(product);
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

  /**
   * Paginate products data
   * @param {Paginator} paginator - the constructed paginator object
   * @returns an array of products from the products table
   */
  paginate(paginator: Paginator): Promise<Array<Product>> {
    return this._createQueryBuilder()
      .where('name LIKE :data')
      .orWhere('price LIKE :data')
      .orWhere('point LIKE :data')
      .setParameters({
        data: `%${paginator.query}%`,
      })
      .skip(paginator.page * paginator.perPage)
      .take(paginator.perPage)
      .orderBy('products.id', 'DESC')
      .getMany();
  }

  /**
   * Count the number of rows based on the provided search term
   * @param {string} query - the search term
   * @returns a number of rows that matches the search term
   */
  count(query: string): Promise<number> {
    return this._createQueryBuilder()
      .where('name LIKE :data')
      .orWhere('price LIKE :data')
      .orWhere('point LIKE :data')
      .setParameters({
        data: `%${query}%`,
      })
      .getCount();
  }
}
