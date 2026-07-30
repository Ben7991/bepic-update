import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor() {}

  async create(queryRunner: QueryRunner, data: Omit<User, 'status'>) {
    const user = new User();
    user.id = data.id;
    user.name = data.name;
    user.password = data.password;
    user.role = data.role;
    user.username = data.username;
    return await queryRunner.manager.save(user);
  }
}
