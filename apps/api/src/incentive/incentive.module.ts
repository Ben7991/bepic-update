import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IncentiveController } from './incentive.controller';
import { IncentiveService } from './incentive.service';
import { Incentive } from './entities/incentive.entity';
import { IncentiveRepository } from './repositories/incentive.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Incentive])],
  controllers: [IncentiveController],
  providers: [IncentiveService, IncentiveRepository],
})
export class IncentiveModule {}
