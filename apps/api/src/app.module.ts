import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

import { AppController } from './app.controller';
import { TypeOrmConfigService } from './typeorm-config.service';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './seeder/seeder.module';
import { IncentiveModule } from './incentive/incentive.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    SeederModule,
    IncentiveModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
