import { IsNotEmpty } from 'class-validator';

export class ItemDto {
  @IsNotEmpty()
  name: string;
}
