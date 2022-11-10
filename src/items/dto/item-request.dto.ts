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
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ImageRequestDto } from './image-request.dto';

export class ItemRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  tokenId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  @MaxLength(8, {
    each: true,
  })
  tags: string[];

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
