import { IsEthereumAddress, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  name: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  ownerAddress: string;
}
