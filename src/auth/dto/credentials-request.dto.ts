import { IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class CredentialsRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;
}
