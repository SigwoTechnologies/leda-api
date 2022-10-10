import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { constants } from '../../constants';
import { Request, Response } from 'express';
import { ExceptionResponse } from '../interfaces/exceptions.interface';
import { BaseException } from '../exception-types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const logger = new Logger();
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    let exceptionResponse: ExceptionResponse;

    if (exception instanceof BaseException) {
      exceptionResponse = exception.getResponse();
    } else {
      let error;

      if (exception instanceof NotFoundException) error = constants.errors.not_found.default;
      else error = constants.errors.internal_exception.default;

      exceptionResponse = {
        name: error.NAME,
        message: error.MESSAGE,
        code: error.CODE,
      };
    }

    exceptionResponse.timestamp = new Date().toISOString();
    exceptionResponse.path = request.url;

    logger.error(`
      ERROR_NAME: ${exception.name}
      ERROR_MESSAGE: ${exception.message}
      TIMESTAMP: ${exceptionResponse.timestamp}
      STACKTRACE: ${exception.stack}`);

    response.status(status).json(exceptionResponse);
  }
}
