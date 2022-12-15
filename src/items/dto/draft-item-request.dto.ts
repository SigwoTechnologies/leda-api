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
  IsOptional,
} from 'class-validator';
import { CreateCollectionDto } from '../../collections/dto/create-collection.dto';
import { ItemPropertyDto } from './item-property.dto';

export class DraftItemRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  collection: CreateCollectionDto;

  @IsEthereumAddress()
  @IsNotEmpty()
  collectionAddress: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(70)
  name: string;

  @IsNotEmpty()
  description: string;

  @Min(0)
  @Max(10)
  royalty: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @MaxLength(14, {
    each: true,
  })
  tags: string[];

  @IsArray()
  @ArrayMaxSize(10)
  @IsOptional()
  itemProperties: ItemPropertyDto[];

  @IsOptional()
  price: string;

  @IsOptional()
  tokenId: number;

  @IsOptional()
  stakingRewards: number;
}
