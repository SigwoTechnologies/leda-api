import { IsEnum, IsNotEmpty } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

export class HistoryRequestDto {
  @IsNotEmpty()
  accountAddress: string;

  @IsNotEmpty()
  itemId: string;

  price: string;

  listId: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  accountId: string;
}
