import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { EncryptionService } from './encryption.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository, EncryptionService],
  exports: [UserRepository, EncryptionService],
})
export class AuthModule {}
