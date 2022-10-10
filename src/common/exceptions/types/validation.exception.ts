import { HttpStatus, ValidationError } from '@nestjs/common';
import { constants } from '../../constants';
import { ExceptionResponse, ValidationResponse } from '../interfaces/exceptions.interface';
import { BaseException } from './base.exception';

/**
 * Defines the validation exceptions class thrown by Nest's class-validator
 */
export class ValidationException extends BaseException {
  /**
   * Creates a new ValidationException instance
   * @param errors errors array with the generated errors from input validators
   * @param message (Optional) message that will be retrieved in the response
   */
  constructor(private errors: ValidationError[], message?: string) {
    super({} as ExceptionResponse, HttpStatus.BAD_REQUEST);
    this.message = message || '';
  }

  getResponse(): ValidationResponse {
    const { NAME, MESSAGE, CODE } = constants.ERRORS.SCHEMA_VALIDATION;
    return {
      name: NAME,
      message: this.message || MESSAGE,
      code: CODE,
      details: this.errors,
    };
  }
}
