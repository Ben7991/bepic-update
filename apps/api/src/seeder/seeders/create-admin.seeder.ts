import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { UserRepository } from '../../auth/repositories/user.repository';
import { Role } from '../../auth/auth.types';
import { genSalt, hash } from 'bcryptjs';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class CreateAdminSeeder {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _configService: ConfigService,
    private readonly _userRepository: UserRepository,
  ) {}

  /**
   * Creates a one-time admin user in the database
   * @returns a message after user is created or throw an error
   */
  async createAdmin() {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const adminDetails = await this._getAdminDetails();
      const existingUser = await this._userRepository.find(
        adminDetails.username,
      );

      if (existingUser) throw new Error('Admin already exist');

      await this._userRepository.create(queryRunner, {
        ...adminDetails,
        role: Role.ADMIN,
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { message: 'Admin successfully added' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      let message = 'Something went wrong';

      if (error instanceof Error) message = error.message;

      throw new InternalServerErrorException(message);
    }
  }

  /**
   * Returns the admin credentials for creating a one-time admin
   * @returns admin credentials
   */
  private async _getAdminDetails(): Promise<
    Pick<User, 'name' | 'password' | 'username'>
  > {
    const saltRounds = Number(
      this._configService.get<string>('SALT_ROUNDS') ?? '',
    );

    if (Number.isNaN(saltRounds)) {
      throw new Error('Please provide missing salt rounds');
    }

    const generatedSalt = await genSalt(saltRounds);
    const password = this._configService.get<string>('ADMIN_PASSWORD') ?? '';
    const hashedPassword = await hash(password, generatedSalt);

    return {
      name: this._configService.get<string>('ADMIN_NAME') ?? '',
      username: this._configService.get<string>('ADMIN_USERNAME') ?? '',
      password: hashedPassword,
    };
  }
}
