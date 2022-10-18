import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { InternalErorrs } from '../../constants';
import { ExceptionResponse } from '../interfaces/exceptions.interface';
import { BaseException } from '../exception-types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const logger = new Logger();
    const context = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let exceptionResponse = {} as ExceptionResponse;

    if (exception instanceof BaseException) {
      exceptionResponse = exception.getResponse();
      status = exception.getStatus();
    } else {
      const { name, message, code } = InternalErorrs.default;

      exceptionResponse = {
        name,
        message,
        code,
      };
    }

    exceptionResponse.timestamp = new Date().toISOString();
    exceptionResponse.path = httpAdapter.getRequestUrl(context.getRequest());

    const globalException = exception as Error;

    logger.error(`
      ERROR_NAME: ${exceptionResponse.name}
      ERROR_MESSAGE: ${exceptionResponse.message}
      TIMESTAMP: ${exceptionResponse.timestamp}
      STACKTRACE: ${globalException.stack}`);

    httpAdapter.reply(context.getResponse(), exceptionResponse, status);
  }
}
