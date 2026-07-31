import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, SelectQueryBuilder } from 'typeorm';

import { User } from '../entities/user.entity';
import { Role } from '../auth.types';

@Injectable()
export class UserRepository {
  constructor(private readonly _dataSource: DataSource) {}

  private _createQueryBuilder(): SelectQueryBuilder<User> {
    return this._dataSource.createQueryBuilder(User, 'users');
  }

  async create(queryRunner: QueryRunner, data: Omit<User, 'status' | 'id'>) {
    const user = new User();
    user.id = await this._generateNextForRoleId(data.role);
    user.name = data.name;
    user.password = data.password;
    user.role = data.role;
    user.username = data.username;
    return await queryRunner.manager.save(user);
  }

  private async _generateNextForRoleId(role: Role): Promise<string> {
    const increment = 1;
    const seed = 10_000_000;
    const initials = role === Role.ADMIN ? 'AD' : 'USA';
    const totalUsersWithRole = await this._dataSource.manager.count(User, {
      where: {
        role,
      },
    });
    return `${initials}${seed + totalUsersWithRole + increment}`;
  }

  find(data: string): Promise<User | null> {
    return this._createQueryBuilder()
      .where('id=:id')
      .orWhere('username=:username')
      .setParameters({
        id: data,
        username: data,
      })
      .getOne();
  }
}
