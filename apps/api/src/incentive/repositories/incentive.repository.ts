import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, SelectQueryBuilder } from 'typeorm';

import { Incentive } from '../entities/incentive.entity';
import { Paginator } from '../../utils/paginator/paginator';
import { ItemAvailabilityStatus } from '../../utils/types.utils';

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
    data: Partial<Pick<Incentive, 'point' | 'award' | 'status'>>,
  ): Promise<Incentive> {
    incentive.point = data.point ?? incentive.point;
    incentive.award = data.award ?? incentive.award;
    incentive.status = data.status ?? incentive.status;
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

  /**
   * Paginate incentives data
   * @param {Paginator} paginator - the constructed paginator object
   * @returns an array of incentives from the incentives table
   */
  paginate(paginator: Paginator): Promise<Array<Incentive>> {
    return this._createQueryBuilder()
      .where(
        'status=:status AND (point LIKE :data OR award LIKE :data OR id LIKE :data)',
        {
          status: ItemAvailabilityStatus.ACTIVE,
          data: `%${paginator.query}%`,
        },
      )
      .skip(paginator.page * paginator.perPage)
      .take(paginator.perPage)
      .orderBy('incentives.id', 'DESC')
      .getMany();
  }

  /**
   * Count the number of rows, when a search term is provied
   * @param {string} query - the search term
   * @returns a number of rows that matches the search term
   */
  count(query: string): Promise<number> {
    return this._createQueryBuilder()
      .where(
        'status=:status AND (point LIKE :data OR award LIKE :data OR id LIKE :data)',
        {
          status: ItemAvailabilityStatus.ACTIVE,
          data: `%${query}%`,
        },
      )
      .getCount();
  }

  /**
   * Count the number of rows based on the availability status
   * @returns a number of rows that matches the search term
   */
  countActiveIncentives(): Promise<number> {
    return this._createQueryBuilder()
      .where('status=:status', {
        status: ItemAvailabilityStatus.ACTIVE,
      })
      .getCount();
  }
}
