import { IsOptional, IsString } from 'class-validator';

export class EditCollectionDto {
  @IsString()
  id: string;

  @IsOptional()
  image: {
    url: string;
    cid: string;
  };

  @IsString()
  name: string;

  @IsString()
  description: string;
}
