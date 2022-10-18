import { HttpStatus, ValidationError } from '@nestjs/common';
import { SchemaValidationErrors } from '../../constants';
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
    const { name, message, code } = SchemaValidationErrors.default;
    return {
      name: name,
      message: this.message || message,
      code: code,
      details: this.errors,
    };
  }
}
