import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SearchRequestDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  topic: string;
}
