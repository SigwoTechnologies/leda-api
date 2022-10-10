import { ValidationError } from '@nestjs/common';

/**
 * Defines the basic exception structure
 */
export interface ExceptionResponseBase {
  /**
   * The name that identifies the type of exception that has occured.
   */
  name: string;
  /**
   * The message that determines in a more verbose way what happened.
   */
  message: string;
  /**
   * An internal code that allows to track the exception by identified codes within the organization
   */
  code: number;
}

/**
 * Defines the base response structure for all exceptions.
 */
export interface ExceptionResponse extends ExceptionResponseBase {
  /**
   * The resource path that was requested.
   */
  path?: string;
  /**
   * The timemstamp when the exception happened.
   */
  timestamp?: string;
}

/**
 * Defines the response structure for validation exceptions.
 */
export interface ValidationResponse extends ExceptionResponse {
  /**
   * Determines the validation errors in an array.
   * @example
   *
   */
  details?: ValidationError[];
}
