import { IsNotEmpty } from 'class-validator';

export class SignUpCredentialsDto {
  @IsNotEmpty()
  address: string;
}
