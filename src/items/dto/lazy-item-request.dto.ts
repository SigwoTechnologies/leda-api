import { IsNotEmpty, IsEthereumAddress, Min, IsEnum, IsOptional } from 'class-validator';
import { LazyProcessType } from '../enums/lazy-process-type.enum';
import { ImageRequestDto } from './image-request.dto';

export class LazyItemRequestDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  minPrice: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  image: ImageRequestDto;

  @IsNotEmpty()
  @Min(0)
  royalties: number;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  @IsEnum(LazyProcessType)
  lazyProcessType: LazyProcessType;

  collection: {
    name: string;
    description: string;
    image: ImageRequestDto;
  };

  @IsOptional()
  tokenId: number;

  @IsOptional()
  stakingRewards: number;
}
