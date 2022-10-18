export const constants = {
  auth: {
    strategy: 'jwt',
  },
  database: 'database',
};

export const SchemaValidationErrors = {
  default: {
    name: 'SCHEMA_VALIDATION',
    message: 'One or more fields contain incorrect values. Please verify and try again.',
    code: 1000,
  },
};

export const UnauthorizedErrors = {
  default: {
    name: 'UNAUTHORIZED',
    message: 'Unauthorized. You do not have permission to complete your request.',
    code: 2000,
  },
};

export const NotFoundErrors = {
  default: {
    name: 'NOT_FOUND',
    message: 'Not found. The resource that you are looking for does not exist.',
    code: 3000,
  },
};

export const BusinessErrors = {
  default: {
    name: 'BUSINESS_RULES',
    message:
      'An error has occurred while processing your request. Please verify your information and try again.',
    code: 4000,
  },
  address_not_associated: {
    name: 'BUSINESS_RULES',
    message: 'The given address does not have an associated account.',
    code: 4001,
  },
  file_extension_not_supported: {
    name: 'BUSINESS_RULES',
    message:
      'The given file type is not supported. Please make sure to use one of the following file types: PNG, JPEG, JPG, GIF',
    code: 4002,
  },
  file_size_exceeded: {
    name: 'BUSINESS_RULES',
    message: 'The given file is too large. The maximum supported size for images is: 1000MG',
    code: 4003,
  },
};

export const InternalErorrs = {
  default: {
    name: 'INTERNAL',
    message:
      'An internal error has occurred. Please help us improve our service by sending an error report.',
    code: 5000,
  },
};
