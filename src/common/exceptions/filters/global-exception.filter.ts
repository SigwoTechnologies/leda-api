import { HttpAdapterHost } from '@nestjs/core';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { HttpErrors } from '../../constants';
import { ExceptionResponse } from '../interfaces/exceptions.interface';
import { BaseException } from '../exception-types';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const logger = new Logger();
    const context = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;
    const correlationId = uuidv4(); // TODO: Make this correlationId available in a header being sent from the marketplace client
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let exceptionResponse = {} as ExceptionResponse;

    if (exception instanceof BaseException) {
      exceptionResponse = exception.getResponse();
      status = exception.getStatus();
    } else if (exception instanceof HttpException) {
      exceptionResponse.name = exception.name;
      exceptionResponse.message = exception.message;
      exceptionResponse.code = exception.getStatus();
      status = exception.getStatus();
    } else {
      const { name, message, code } = HttpErrors.default;

      exceptionResponse = {
        name,
        message,
        code,
      };
    }

    exceptionResponse.timestamp = new Date().toISOString();
    exceptionResponse.path = httpAdapter.getRequestUrl(context.getRequest());
    exceptionResponse.correlationId = correlationId;

    const globalException = exception as Error;

    logger.error(`
      ERROR_NAME: ${exceptionResponse.name}
      ERROR_MESSAGE: ${exceptionResponse.message}
      TIMESTAMP: ${exceptionResponse.timestamp}
      CORRELATIONID: ${exceptionResponse.correlationId}
      STACKTRACE: ${globalException.stack}`);

    httpAdapter.reply(context.getResponse(), exceptionResponse, status);
  }
}
