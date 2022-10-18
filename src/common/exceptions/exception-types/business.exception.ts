import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { BusinessErrors } from '../../constants';
import { ExceptionResponse } from '../interfaces/exceptions.interface';
import { ExceptionSchema } from '../types/exception-schema';

/**
 * Defines the unauthorized exceptions to return custom messages
 */
export class BusinessException extends BaseException {
  /**
   * Creates a new Business exception
   * @param error (Optional) error object to get all the specific error information
   * @param message (Optional) message that will be retrieved in the response
   * @param status (Optional) http status
   * @usage See common.src.lib.constants
   */
  constructor(private error?: ExceptionSchema, message?: string, status?: HttpStatus) {
    super({} as ExceptionResponse, status || HttpStatus.BAD_REQUEST);
    this.message = message || '';
    this.error = error;
  }

  getResponse(): ExceptionResponse {
    const { name, message, code } = BusinessErrors.default;
    const some = {
      name: this.error?.name || name,
      message: this.message || this.error?.message || message,
      code: this.error?.code || code,
    };

    return some;
  }
}
