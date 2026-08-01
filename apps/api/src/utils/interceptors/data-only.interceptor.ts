import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

type Response<T> = {
  data: T;
};

@Injectable()
export class DataOnlyInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    _: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((value) => ({ data: value })));
  }
}
