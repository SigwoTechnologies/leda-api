import { IsNotEmpty, IsNumber, IsPositive, Min, IsOptional, IsString } from 'class-validator';

export class PaginationRequestDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;

  @IsString()
  @IsOptional()
  likesOrder: 'asc' | 'desc';

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsOptional()
  priceFrom: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @IsOptional()
  priceTo: number;
}
