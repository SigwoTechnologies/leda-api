import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive, Max, Min, ValidateIf } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class NewestItemsRequestDto extends PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(15)
  qty: number;
}
