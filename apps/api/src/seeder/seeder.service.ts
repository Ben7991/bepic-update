import { Injectable } from '@nestjs/common';

import { CreateAdminSeeder } from './seeders/create-admin.seeder';
import { IncentiveSeeder } from './seeders/incentive.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly _createAdminSeeder: CreateAdminSeeder,
    private readonly _incentiveSeeder: IncentiveSeeder,
  ) {}

  createAdmin() {
    return this._createAdminSeeder.createAdmin();
  }

  loadIncentives() {
    return this._incentiveSeeder.loadIncentives();
  }
}
