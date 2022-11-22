import { Type } from 'class-transformer';
import { IsNumber, ValidateIf } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class NewestItemsRequestDto extends PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((val) => +val <= 15)
  qty: number;
}
