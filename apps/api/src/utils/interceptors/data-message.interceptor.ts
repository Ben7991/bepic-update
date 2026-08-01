import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export type Response<T> = {
  message: string;
  data: T;
};

@Injectable()
export class DataMessageInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly _message: string) {}

  intercept(
    _: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        message: this._message,
        data,
      })),
    );
  }
}
