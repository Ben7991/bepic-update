import { Global, Module } from '@nestjs/common';

import { DataMessageInterceptor } from './interceptors/data-message.interceptor';
import { DataOnlyInterceptor } from './interceptors/data-only.interceptor';

@Global()
@Module({
  providers: [DataMessageInterceptor, DataOnlyInterceptor],
})
export class SharedModule {}
