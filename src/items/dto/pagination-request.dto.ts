import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ItemPaginationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  likesOrder: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((val) => !!val)
  priceFrom?: number | undefined;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((val) => !!val)
  priceTo?: number | undefined;
}
