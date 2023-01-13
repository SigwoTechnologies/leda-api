import { IsOptional, IsString } from 'class-validator';

export class EditAccountDto {
  @IsOptional()
  background: {
    url: string;
    cid: string;
  };

  @IsOptional()
  picture: {
    url: string;
    cid: string;
  };

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  username: string;
}
