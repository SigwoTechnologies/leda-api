import { IsNotEmpty } from 'class-validator';

export class ListItemRequestDto {
  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  listId: number;

  @IsNotEmpty()
  address: string;

  itemId: string;
}
