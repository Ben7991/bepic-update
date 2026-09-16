import { Global, Module } from '@nestjs/common';

import { PaginatorBuilder } from './providers/paginator.builder';

@Global()
@Module({
  providers: [PaginatorBuilder],
  exports: [PaginatorBuilder],
})
export class SharedModule {}
