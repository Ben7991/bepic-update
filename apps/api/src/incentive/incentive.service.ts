import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { IncentiveDto } from './dto/incentive.dto';
import { AppLogger } from '../utils/logger/app.logger';
import { IncentiveRepository } from './repositories/incentive.repository';
import { ApplicationException } from '../utils/exception/application.exception';
import { Incentive } from './entities/incentive.entity';
import { ItemAvailabilityStatus, MessageOnlyType } from '../utils/types.utils';
import { Paginator } from '../utils/paginator/paginator';

@Injectable()
export class IncentiveService {
  private readonly _logger = new AppLogger(IncentiveService.name);

  constructor(
    private readonly _dataSource: DataSource,
    private readonly _incentiveRepository: IncentiveRepository,
  ) {}

  /**
   * Handles the pagination of incentives data
   * @param {Paginator} paginator
   * @returns an object containing, count and an array of incentives as data
   */
  async paginate(paginator: Paginator) {
    try {
      const [count, data] = await Promise.all([
        this._incentiveRepository.count(paginator.query),
        this._incentiveRepository.paginate(paginator),
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
   * Handles creation of incentives. This function ensures there are no duplicate
   * awards, or point ever entered in more than one row
   * @param {IncentiveDto} body - the request body
   * @returns newly added incentive data
   */
  async create(body: IncentiveDto): Promise<Incentive> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingIncentiveByPoint = await this._incentiveRepository.find(
        body.point,
      );
      const existingIncentiveByAward = await this._incentiveRepository.find(
        body.award,
      );

      if (existingIncentiveByPoint || existingIncentiveByAward)
        throw new ApplicationException('No duplicate entries are allowed');

      const incentive = await this._incentiveRepository.create(
        queryRunner,
        body,
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return incentive;
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
   * Handles incentive data update, specifically the point and award fields
   * @param {IncentiveDto} body - the request body
   * @returns newly added incentive data
   */
  async update(body: IncentiveDto, id: number): Promise<Incentive> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingIncentive = await this._incentiveRepository.find(id);

      if (!existingIncentive)
        throw new ApplicationException('No incentive with such id exist');

      const incentive = await this._incentiveRepository.update(
        queryRunner,
        existingIncentive,
        body,
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return incentive;
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
   * Handles fake deletion of incentive
   * @param {number} id - incentive id
   * @returns an object with containing a message
   */
  async destroy(id: number): Promise<MessageOnlyType> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingIncentive = await this._incentiveRepository.find(id);

      if (!existingIncentive)
        throw new ApplicationException('No incentive with such id exist');

      await this._incentiveRepository.update(queryRunner, existingIncentive, {
        status: ItemAvailabilityStatus.HIDDEN,
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { message: 'Incentive deleted successfully' };
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
