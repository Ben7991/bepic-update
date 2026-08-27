import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly _configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this._configService.get<string>('DB_HOST') ?? 'localhost',
      port: Number(this._configService.get<string>('DB_PORT')),
      username: this._configService.get<string>('DB_USER') ?? 'root',
      password: this._configService.get<string>('DB_PASSWORD'),
      database: this._configService.get<string>('DB_NAME'),
      entities: [`${__dirname}/**/entities/*.entity{.js,.ts}`],
      synchronize: true,
    };
  }
}
