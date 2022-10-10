export const constants = {
  auth: {
    strategy: 'jwt',
  },
  database: 'database',
  errors: {
    schema_validation: {
      name: 'SCHEMA_VALIDATION',
      message: 'One or more fields contain incorrect values. Please verify and try again.',
      code: 1000,
    },
    unauthorized: {
      default: {
        name: 'UNAUTHORIZED',
        message: 'Unauthorized. You do not have permission to complete your request.',
        code: 2000,
      },
    },
    not_found: {
      default: {
        name: 'NOT_FOUND',
        message: 'Not found. The resource that you are looking for does not exist.',
        code: 3000,
      },
    },
    business_exception: {
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
    },
    internal_exception: {
      default: {
        name: 'INTERNAL',
        message:
          'An internal error has occurred. Please help us improve our service by sending an error report.',
        code: 5000,
      },
    },
  },
};
