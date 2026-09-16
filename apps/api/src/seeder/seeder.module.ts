import { Module } from '@nestjs/common';

import { IncentiveModule } from '../incentive/incentive.module';
import { AuthModule } from '../auth/auth.module';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';
import { CreateAdminSeeder } from './seeders/create-admin.seeder';
import { IncentiveSeeder } from './seeders/incentive.seeder';

@Module({
  imports: [AuthModule, IncentiveModule],
  controllers: [SeederController],
  providers: [SeederService, CreateAdminSeeder, IncentiveSeeder],
})
export class SeederModule {}
