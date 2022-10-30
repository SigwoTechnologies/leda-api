import { IsNotEmpty } from 'class-validator';

export class ListItemRequestDto {
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  listId: number;
}
