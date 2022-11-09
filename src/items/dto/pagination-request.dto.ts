import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ItemPaginationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  likesOrder: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  priceFrom?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  priceTo?: number;
}
