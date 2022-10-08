import { IsNotEmpty } from 'class-validator';

export class ImageRequestDto {
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  cid: string;
}
