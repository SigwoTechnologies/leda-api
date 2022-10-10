import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionResponse } from '../interfaces/exceptions.interface';

/**
 * Defines the base class which will be used by other exceptions to derived from
 */
export abstract class BaseException extends HttpException {
  /**
   * Creates a new ValidationException instance
   * @param response response object which will be returned back to the client
   */
  constructor(response: ExceptionResponse, status: HttpStatus) {
    super(response, status);
  }

  /**
   * Defines the response to be returned to the client
   */
  abstract getResponse(): ExceptionResponse;
}
