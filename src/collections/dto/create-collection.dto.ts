import { IsArray, IsNotEmpty, IsNumber, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Collection } from '../entities/collection.entity';

export class CreateCollectionDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  name: string;

  @IsNotEmpty()
  description: string;
}

export class CollectionResponseDto {
  @IsNumber()
  @Min(1)
  totalCount: number;

  @IsNumber()
  @Min(1)
  page: number;

  @IsNumber()
  @Min(1)
  @Max(50)
  limit: number;

  @IsArray()
  collections: Collection[];
}
