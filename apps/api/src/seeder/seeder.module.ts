import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';

@Module({
  imports: [AuthModule],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
