import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CollectionPaginationDto extends PaginationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @IsString()
  collectionId: number;

  @IsOptional()
  @IsString()
  creationDirection: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  mintType: 'lazy' | 'normal';
}
