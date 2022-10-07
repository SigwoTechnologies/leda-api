import { ItemRequestDto } from '../dto/item-request.dto';
import { Item } from '../entities/item.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Account } from 'src/config/entities.config';

@Injectable()
export class ItemRepository extends Repository<Item> {
  constructor(private dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  async createItem(itemRequestDto: ItemRequestDto, accountId: string): Promise<Item> {
    const { tokenId, name, collectionAddress, description, price, royalty, status, image } =
      itemRequestDto;

    const item = this.create({
      tokenId,
      collectionAddress,
      name,
      description,
      price,
      royalty,
      status,
      image: { url: image.url, ipfsUrl: image.ipfsUrl },
      owner: new Account(accountId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.save(item);
    return item;
  }
}
