import { Controller, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { SeederService } from './seeder.service';

/**
 * Handles database seeding
 */
@ApiExcludeController()
@Controller('seeder')
export class SeederController {
  constructor(private readonly _seederService: SeederService) {}

  /**
   * Handles the creation of user admin once, if it already exist
   * return an internal server error
   * @returns a admin user
   */
  @Post('create-admin')
  async createAdmin() {
    return this._seederService.createAdmin();
  }
}
