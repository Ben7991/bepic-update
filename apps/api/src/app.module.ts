import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { TypeOrmConfigService } from './typeorm-config.service';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './seeder/seeder.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    SeederModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
