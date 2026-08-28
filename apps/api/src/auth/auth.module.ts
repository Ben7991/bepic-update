import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { EncryptionService } from './encryption.service';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, EncryptionService, AuthGuard],
  exports: [UserRepository, EncryptionService, AuthGuard],
})
export class AuthModule {}
