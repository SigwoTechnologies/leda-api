import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { HttpErrors } from '../../constants';
import { ExceptionResponse } from '../interfaces/exceptions.interface';
import { ExceptionSchema } from '../types/exception-schema';

/**
 * Defines the unauthorized exception to return custom messages
 */
export class UnauthorizedException extends BaseException {
  /**
   * Creates a new custom Unauthorized exception
   * @param error (Optional) error object to get all the specific error information
   * @param message (Optional) message that will be retrieved in the response
   * @usage See common.src.lib.constants
   */
  constructor(private error?: ExceptionSchema, message?: string) {
    super({} as ExceptionResponse, HttpStatus.UNAUTHORIZED);
    this.message = message || '';
    this.error = error;
  }

  getResponse(): ExceptionResponse {
    const { name, message, code } = HttpErrors.unauthorized;
    return {
      name: this.error?.name || name,
      message: this.message || this.error?.message || message,
      code: this.error?.code || code,
    };
  }
}
