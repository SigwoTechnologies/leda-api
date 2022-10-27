import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MaxLength,
  Min,
  Max,
  IsEthereumAddress,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ImageRequestDto } from './image-request.dto';

export class ItemRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  tokenId: number;

  @IsEthereumAddress()
  @IsNotEmpty()
  collectionAddress: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  description: string;

  @Min(0)
  @Max(10)
  @IsPositive()
  royalty: number;

  @IsNumber()
  @IsOptional()
  status: number;

  @IsNotEmpty()
  image: ImageRequestDto;

  wei: string;
}
