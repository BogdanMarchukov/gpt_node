import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  private logger = new Logger(ExceptionFilter.name);
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    this.logger.error(exception.getError());
    return throwError(() => exception.getError());
  }
}
