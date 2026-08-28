import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, SelectQueryBuilder } from 'typeorm';

import { Incentive } from '../entities/incentive.entity';

/**
 * Handles all communication to the `incentives` table in the database
 */
@Injectable()
export class IncentiveRepository {
  constructor(private readonly _dataSource: DataSource) {}

  /**
   * Returns a queryBuilder for communicating to the `users` table
   * @returns a user queryBuilder
   */
  private _createQueryBuilder(): SelectQueryBuilder<Incentive> {
    return this._dataSource.createQueryBuilder(Incentive, 'incentives');
  }

  /**
   * Adds a new incentive row in the `incentives` table
   * @param {QueryRunner} queryRunner
   * @param {Pick<Incentive, 'point' | 'award'>} data
   * @returns an incentive representing a row in the incentives table
   */
  async create(
    queryRunner: QueryRunner,
    data: Pick<Incentive, 'point' | 'award'>,
  ): Promise<Incentive> {
    const incentive = new Incentive();
    incentive.point = data.point;
    incentive.award = data.award;
    return await queryRunner.manager.save(incentive);
  }

  /**
   * Updates existing incentive in the `incentives` table
   * @param {QueryRunner} queryRunner
   * @param {Incentive} incentive
   * @param {Pick<Incentive, 'point' | 'award'>} data
   * @returns an incentive representing a row in the incentives table
   */
  async update(
    queryRunner: QueryRunner,
    incentive: Incentive,
    data: Pick<Incentive, 'point' | 'award'>,
  ): Promise<Incentive> {
    incentive.point = data.point;
    incentive.award = data.award;
    return await queryRunner.manager.save(incentive);
  }

  /**
   * Retrieves an incentive object from the `incentives` table or null
   * if the provided data isn't mapped to any column in the table
   * @param {string} data
   * @returns a incentive object or null
   */
  find(data: string | number): Promise<Incentive | null> {
    return this._createQueryBuilder()
      .where('point=:data')
      .orWhere('award=:data')
      .orWhere('id=:data')
      .setParameters({ data })
      .getOne();
  }
}
