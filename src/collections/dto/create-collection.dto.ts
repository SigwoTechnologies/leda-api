import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  name: string;

  @IsNotEmpty()
  description: string;

  image: {
    url: string;
    cid: string;
  };
}
