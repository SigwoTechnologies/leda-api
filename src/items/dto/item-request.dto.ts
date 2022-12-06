import { IsNotEmpty, IsNumber, IsEthereumAddress } from 'class-validator';
import { ImageRequestDto } from './image-request.dto';

export class ItemRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  tokenId: number;

  @IsNotEmpty()
  image: ImageRequestDto;

  collection: {
    name: string;
    description: string;
    image: ImageRequestDto;
  };
}
