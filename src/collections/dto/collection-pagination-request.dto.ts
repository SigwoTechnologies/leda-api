import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CollectionPaginationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  collectionId: string;

  @IsOptional()
  @IsString()
  creationOrder: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  mintType: 'lazy' | 'normal';
}
