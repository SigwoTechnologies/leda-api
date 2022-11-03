import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../../config/entities.config';
import { History } from '../entities/history.entity';
import { Item } from '../entities/item.entity';
import { TransactionType } from '../enums/transaction-type.enum';

@Injectable()
export class HistoryRepository extends Repository<History> {
  constructor(private dataSource: DataSource) {
    super(History, dataSource.createEntityManager());
  }

  async findAllByItemId(itemId: string): Promise<History[]> {
    return this.find({
      where: {
        item: new Item(itemId),
      },
      relations: ['item', 'owner', 'item.image'],
    });
  }

  async createHistory({
    itemId,
    price,
    accountId,
    transactionType,
    listId,
  }: {
    itemId: string;
    price: string;
    accountId: string;
    transactionType: TransactionType;
    listId: number;
  }): Promise<History> {
    const data = this.create({
      price,
      transactionType,
      listId,
      item: new Item(itemId),
      owner: new Account(accountId),
    });

    await this.save(data);

    return data;
  }
}
