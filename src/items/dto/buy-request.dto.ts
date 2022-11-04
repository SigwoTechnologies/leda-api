import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class BuyRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  itemId: string;
}
