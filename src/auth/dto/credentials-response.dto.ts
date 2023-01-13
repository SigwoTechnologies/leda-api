import { Account } from 'src/config/entities.config';

export class CredentialsResponseDto {
  access_token: string;
  account: Account;
}
