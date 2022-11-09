export const constants = {
  database: 'database',
};

export const SchemaValidationErrors = {
  default: {
    name: 'SCHEMA_VALIDATION',
    message: 'One or more fields contain incorrect values. Please verify and try again.',
    code: 1000,
  },
};

export const HttpErrors = {
  unauthorized: {
    name: 'UNAUTHORIZED',
    message: 'You do not have permission to complete this request.',
    code: 2000,
  },
  not_found: {
    name: 'NOT_FOUND',
    message: 'The resource that you are looking for does not exist.',
    code: 3000,
  },
  default: {
    name: 'INTERNAL',
    message:
      'An internal error has occurred. Please help us improve our service by sending an error report.',
    code: 5000,
  },
};

export const BusinessErrors = {
  default: {
    name: 'BAD_REQUEST',
    message:
      'An error has occurred while processing your request. Please verify your information and try again.',
    code: 4000,
  },
  address_not_associated: {
    name: 'ADDRESS_NOT_ASSOCIATED',
    message: 'The given address does not have an associated account.',
    code: 4001,
  },
  file_extension_not_supported: {
    name: 'FILE_EXTENSION_NOT_SUPPORTED',
    message:
      'The given file type is not supported. Please make sure to use one of the following file types: PNG, JPEG, JPG, GIF',
    code: 4002,
  },
  file_size_exceeded: {
    name: 'FILE_SIZE_EXCEEDED',
    message: 'The given file is too large. The maximum supported size for images is: 1000MG',
    code: 4003,
  },
  address_required: {
    name: 'ADDRESS_REQUIRED',
    message: 'The address is required. Please verify your information and try again.',
    code: 4004,
  },
  signature_required: {
    name: 'SIGNATURE_REQUIRED',
    message: 'The signature is required. Please verify your information and try again.',
    code: 4005,
  },
  nonce_required: {
    name: 'NONCE_REQUIRED',
    message: 'The nonce is required. Please verify your information and try again.',
    code: 4006,
  },
  incorrect_tags_size: {
    name: 'INCORRECT_TAGS_SIZE',
    message: 'The tags amount must be between 1 and 8',
    code: 4007,
  },
};
