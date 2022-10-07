import { ItemDto } from './item.dto';
import { Item } from './item.entity';

import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemRepository extends Repository<Item> {
  constructor(private dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  async createItem(itemDto: ItemDto): Promise<Item> {
    const { name } = itemDto;

    const Item = this.create({
      name,
    });

    await this.save(Item);
    return Item;
  }
}
