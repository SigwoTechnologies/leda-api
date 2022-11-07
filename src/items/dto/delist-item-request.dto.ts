import { IsNotEmpty } from 'class-validator';

export class DelistItemRequestDto {
  @IsNotEmpty()
  address: string;

  itemId: string;
}
