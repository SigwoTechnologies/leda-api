import { IsNotEmpty } from 'class-validator';

export class SigninRequestDto {
  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  nonce: string;
}
