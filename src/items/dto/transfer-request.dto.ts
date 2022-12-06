import { IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class TransferDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  voucherId: string;
}
