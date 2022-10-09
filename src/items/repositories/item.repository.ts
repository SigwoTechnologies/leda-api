import { ItemRequestDto } from '../dto/item-request.dto';
import { Item } from '../entities/item.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Account } from 'src/config/entities.config';
import { ItemStatus } from '../enums/item-status.enum';

@Injectable()
export class ItemRepository extends Repository<Item> {
  constructor(private dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  async findAll(): Promise<Item[]> {
    return this.createQueryBuilder('item')
      .select([
        'item.itemId',
        'item.tokenId',
        'item.name',
        'item.description',
        'item.price',
        'item.royalty',
        'item.likes',
        'item.status',
        'image.url',
        'item.createdAt',
        'owner.address',
      ])
      .innerJoin('item.image', 'image')
      .innerJoin('item.owner', 'owner')
      .where('item.status=:status', { status: ItemStatus.Listed })
      .orderBy('item.createdAt', 'DESC')
      .getMany();
  }

  async createItem(itemRequestDto: ItemRequestDto, accountId: string): Promise<Item> {
    const { tokenId, name, collectionAddress, description, royalty, status, image, wei } =
      itemRequestDto;

    const item = this.create({
      tokenId,
      collectionAddress,
      name,
      description,
      price: wei,
      royalty,
      status,
      image: { url: image.url, cid: image.cid },
      owner: new Account(accountId),
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
    });

    await this.save(item);
    return item;
  }
}
