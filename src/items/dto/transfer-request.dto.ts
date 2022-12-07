import { IsNotEmpty, IsEthereumAddress, IsNumber } from 'class-validator';

export class TransferDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  voucherId: string;

  @IsNotEmpty()
  @IsNumber()
  tokenId: number;
}
