import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IncentiveRepository } from '../../incentive/repositories/incentive.repository';
import { incentiveSeeds } from '../seeder.constants';

@Injectable()
export class IncentiveSeeder {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _incentiveRepository: IncentiveRepository,
  ) {}

  async loadIncentives() {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const incentive of incentiveSeeds) {
        await this._incentiveRepository.create(queryRunner, incentive);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { message: 'Incentives loaded successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  }
}
