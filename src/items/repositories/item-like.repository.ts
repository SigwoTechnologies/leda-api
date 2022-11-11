import { Account } from '../../account/entities/account.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { ItemLike } from '../entities/item-like.entity';
import { ItemStatus } from '../enums/item-status.enum';

@Injectable()
export class ItemLikeRepository extends Repository<ItemLike> {
  constructor(private dataSource: DataSource) {
    super(ItemLike, dataSource.createEntityManager());
  }

  async getTotalOfLikesFromItem(itemId: string): Promise<number> {
    return this.createQueryBuilder('itemLike')
      .innerJoin('itemLike.item', 'item')
      .where('item.itemId = :itemId', { itemId })
      .andWhere('item.status = :status', { status: ItemStatus.Listed })
      .getCount();
  }

  async createItemLike(itemId: string, accountId: string): Promise<ItemLike> {
    const itemLike = this.create({
      item: new Item(itemId),
      account: new Account(accountId),
    });

    await this.save(itemLike);

    return itemLike;
  }
}
