import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { NotFoundErrors } from '../../constants';
import { ExceptionResponse } from '../interfaces/exceptions.interface';

/**
 * Defines the not found exception to return custom messages
 */
export class NotFoundException extends BaseException {
  /**
   * Creates a new custom NotFound exception
   * @param message message that will be retrieved in the response
   */
  constructor(message: string) {
    super({} as ExceptionResponse, HttpStatus.NOT_FOUND);
    this.message = message;
  }

  getResponse(): ExceptionResponse {
    const { name, message, code } = NotFoundErrors.default;
    return {
      name: name,
      message: this.message || message,
      code: code,
    };
  }
}
