import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../../config/entities.config';
import { HistoryRequestDto } from '../dto/history-request.dto';
import { History } from '../entities/history.entity';
import { Item } from '../entities/item.entity';

@Injectable()
export class HistoryRepository extends Repository<History> {
  constructor(private dataSource: DataSource) {
    super(History, dataSource.createEntityManager());
  }

  async findAll(): Promise<History[]> {
    return this.find({
      relations: ['item', 'owner', 'item.image'],
    });
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
  }: HistoryRequestDto): Promise<History> {
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
