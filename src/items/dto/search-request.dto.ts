import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchRequestDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  topic: string;
}
