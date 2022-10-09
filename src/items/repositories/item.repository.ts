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

  async findAll(): Promise<Item[]> {
    return this.createQueryBuilder('item')
      .select([
        'item.itemId',
        'item.name',
        'item.description',
        'item.price',
        'item.royalty',
        'item.likes',
        'item.status',
        'image.url',
        'owner.address',
      ])
      .innerJoin('item.image', 'image')
      .innerJoin('item.owner', 'owner')
      .getMany();
  }

  async findNewest(): Promise<Item[]> {
    return this.createQueryBuilder('item')
      .select([
        'item.itemId',
        'item.name',
        'item.description',
        'item.price',
        'item.royalty',
        'item.likes',
        'item.status',
        'item.createdAt',
        'image.url',
        'owner.address',
      ])
      .innerJoin('item.image', 'image')
      .innerJoin('item.owner', 'owner')
      .orderBy('item.createdAt', 'DESC')
      .take(5)
      .getMany();
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
