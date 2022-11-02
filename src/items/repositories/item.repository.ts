import { ItemRequestDto } from '../dto/item-request.dto';
import { PaginationRequestDto } from '../dto/pagination-request.dto';
import { Item } from '../entities/item.entity';
import { Between, DataSource, Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Account } from '../../config/entities.config';
import { ItemStatus } from '../enums/item-status.enum';
import { SearchRequestDto } from '../dto/search-request.dto';

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
        'item.listId',
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

  async findByAccount(accountId: string): Promise<Item[]> {
    return this.createQueryBuilder('item')
      .select([
        'item.itemId',
        'item.tokenId',
        'item.listId',
        'item.name',
        'item.description',
        'item.price',
        'item.royalty',
        'item.likes',
        'item.status',
        'image.url',
        'item.createdAt',
        'owner.accountId',
        'owner.address',
        'author.accountId',
        'author.address',
      ])
      .innerJoin('item.image', 'image')
      .innerJoin('item.owner', 'owner')
      .innerJoin('item.author', 'author')
      .where('item.ownerId = :accountId OR item.authorId = :accountId', { accountId })
      .orderBy('item.createdAt', 'DESC')
      .getMany();
  }

  async findById(itemId: string): Promise<Item> {
    return this.createQueryBuilder('item')
      .select([
        'item.itemId',
        'item.tokenId',
        'item.listId',
        'item.name',
        'item.description',
        'item.price',
        'item.royalty',
        'item.likes',
        'item.status',
        'image.url',
        'item.createdAt',
        'owner.accountId',
        'owner.address',
        'author.accountId',
        'author.address',
      ])
      .innerJoin('item.image', 'image')
      .innerJoin('item.owner', 'owner')
      .innerJoin('item.author', 'author')
      .where('item.itemId = :itemId', { itemId })
      .orderBy('item.createdAt', 'DESC')
      .getOne();
  }

  async listAnItem(itemId: string, listId: number, price: string): Promise<void> {
    await this.update(
      {
        itemId,
      },
      { price, listId, status: ItemStatus.Listed, updatedAt: new Date() }
    );
  }

  async buyItem(itemId: string, accountId: string): Promise<void> {
    await this.update(
      {
        itemId,
      },
      { owner: new Account(accountId), status: ItemStatus.NotListed, updatedAt: new Date() }
    );
  }

  async search(topicValue: SearchRequestDto) {
    const items = await this.find({
      where: {
        name: Like(`%${topicValue.topic.toLowerCase()}%`),
        description: Like(`%${topicValue.topic.toLowerCase()}%`),
      },
    });
    const itemsLength = items.length;
    return { items, itemsLength };
  }

  async pagination(PaginationRequestDto: PaginationRequestDto) {
    const items = await this.find({
      relations: {
        image: true,
        owner: true,
        author: true,
      },
      select: {
        image: { url: true },
        owner: { accountId: true },
        author: { accountId: true, address: true },
      },
      take: PaginationRequestDto.limit,
      order: {
        likes: PaginationRequestDto.likesOrder,
      },
      /* where: {
        price: Between(String(priceFrom), String(priceTo)),
      }, */
    });
    const itemsLength = items.length;
    return { items, itemsLength };
  }

  async createItem(itemRequestDto: ItemRequestDto, account: Account): Promise<Item> {
    const { tokenId, name, collectionAddress, description, royalty, status, image, wei } =
      itemRequestDto;

    const { accountId, address } = account;

    const item = this.create({
      tokenId,
      collectionAddress,
      name,
      description,
      price: wei,
      royalty,
      status,
      image: { url: image.url, cid: image.cid },
      author: new Account(accountId),
      owner: new Account(accountId),
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
    });

    await this.save(item);

    item.owner.address = address;
    item.author.address = address;

    return item;
  }
}
