import { IsNotEmpty, IsEthereumAddress, Min, IsPositive } from 'class-validator';
import { ImageRequestDto } from './image-request.dto';

export class LazyItemRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  minPrice: string;

  @IsNotEmpty()
  image: ImageRequestDto;

  @Min(0)
  @IsPositive()
  royalties: number;

  @IsNotEmpty()
  signature: string;
}
