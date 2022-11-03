import { IsEnum, IsNotEmpty } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

export class HistoryRequestDto {
  @IsNotEmpty()
  accountId: string;

  @IsNotEmpty()
  itemId: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  listId: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;
}
