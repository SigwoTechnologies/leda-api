import { SetMetadata } from '@nestjs/common';

/**
 * Attaches the address field name into the request metadata, so it can be validated against the JWT payload in the AddressGuard
 * @param addressField Specify the field name that the address should be found, wheather it is in the body or in the query string
 * @example addressField could be 'address', which means we are sending a body field named 'address', or a query param named: 'address'
 */
export const IsAddressValid = (addressField = 'address') =>
  SetMetadata('addressField', addressField);
