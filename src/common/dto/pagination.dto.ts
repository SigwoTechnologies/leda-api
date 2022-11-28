import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(4)
  @Max(20)
  @Type(() => Number)
  limit: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((p) => !!p.search)
  search?: string;

  skip?: number;
}
