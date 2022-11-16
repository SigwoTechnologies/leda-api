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
}
