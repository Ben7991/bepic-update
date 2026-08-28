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

@Injectable()
export class IncentiveService {
  private readonly _logger = new AppLogger(IncentiveService.name);

  constructor(
    private readonly _dataSource: DataSource,
    private readonly _incentiveRepository: IncentiveRepository,
  ) {}

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
}
