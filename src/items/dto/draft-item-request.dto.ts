import {
  IsNotEmpty,
  IsPositive,
  MaxLength,
  Min,
  Max,
  IsEthereumAddress,
  MinLength,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayNotEmpty,
} from 'class-validator';
import { ItemPropertyDto } from './item-property.dto';

export class DraftItemRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

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

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  @MaxLength(8, {
    each: true,
  })
  tags: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  itemProperties: ItemPropertyDto[];
}
