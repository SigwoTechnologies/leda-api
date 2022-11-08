import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class DelistItemRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  itemId: string;
}
