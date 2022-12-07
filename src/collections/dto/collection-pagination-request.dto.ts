import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CollectionPaginationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  creationOrder: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  popularityOrder: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  mintType: 'lazy' | 'normal';
}
