import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, SelectQueryBuilder } from 'typeorm';

import { User } from '../entities/user.entity';
import { Role } from '../auth.types';

/**
 * Handles all communication to the `users` table in the database
 */
@Injectable()
export class UserRepository {
  constructor(private readonly _dataSource: DataSource) {}

  /**
   * Returns a queryBuilder for communicating to the `users` table
   * @returns a user queryBuilder
   */
  private _createQueryBuilder(): SelectQueryBuilder<User> {
    return this._dataSource.createQueryBuilder(User, 'users');
  }

  /**
   * Adds a new user row in the `users` table
   * @param {QueryRunner} queryRunner
   * @param {Omit<User, 'status' | 'id'>} data
   * @returns a user object representing a row in the users table
   */
  async create(
    queryRunner: QueryRunner,
    data: Omit<User, 'status' | 'id'>,
  ): Promise<User> {
    const user = new User();
    user.id = await this._generateNextForRoleId(data.role);
    user.name = data.name;
    user.password = data.password;
    user.role = data.role;
    user.username = data.username;
    return await queryRunner.manager.save(user);
  }

  /**
   * Generates a user id based on the provided preferred user role
   * @param {Role} role - The preferred user role
   * @returns the generated user id for the next user row
   */
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

  /**
   * Updates a user name, password and status in the database
   * @param {QueryRunner} queryRunner
   * @param {User} user
   * @param {Pick<User, 'name' | 'password' | 'status'>} data
   * @returns a user with changed details
   */
  async update(
    queryRunner: QueryRunner,
    user: User,
    data: Pick<User, 'name' | 'password' | 'status' | 'imagePath'>,
  ): Promise<User> {
    user.name = data.name;
    user.password = data.password;
    user.imagePath = data.imagePath;
    user.status = data.status;
    return await queryRunner.manager.save(user);
  }

  /**
   * Retrieves a user object from the `users` table or null
   * if the provided data isn't mapped to any column in the table
   * @param {string} data
   * @returns a user object or null
   */
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
