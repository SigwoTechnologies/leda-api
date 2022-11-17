import { ItemRequestDto } from '../dto/item-request.dto';
import { ItemPaginationDto } from '../dto/pagination-request.dto';
import { Item } from '../entities/item.entity';
import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Raw,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ItemStatus } from '../enums/item-status.enum';
import { Between } from 'typeorm';
import { PriceRangeDto } from '../dto/price-range.dto';
import { Tag } from '../entities/tag.entity';
import { DraftItemRequestDto } from '../dto/draft-item-request.dto';
import { Account } from '../../account/entities/account.entity';
import { Image } from '../entities/image.entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { History } from '../entities/history.entity';
import { ItemProperty } from '../entities/item-property.entity';

@Injectable()
export class ItemRepository extends Repository<Item> {
  constructor(private dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }

  private getItemQueryBuilder(): SelectQueryBuilder<Item> {
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
        'tag.name',
        'tag.id',
        'author.accountId',
        'author.address',
        'property.key',
        'property.value',
      ])
      .innerJoin('item.owner', 'owner')
      .innerJoin('item.tags', 'tag')
      .innerJoin('item.author', 'author')
      .innerJoin('item.itemProperties', 'property')
      .leftJoin('item.image', 'image');
  }

  async findAll(): Promise<Item[]> {
    return this.getItemQueryBuilder()
      .where('item.status=:status', { status: ItemStatus.Listed })
      .orderBy('item.createdAt', 'DESC')
      .getMany();
  }

  async findByAccount(accountId: string): Promise<Item[]> {
    return this.getItemQueryBuilder()
      .where('item.status != :status', { status: ItemStatus.Draft })
      .andWhere('(item.ownerId = :accountId OR item.authorId = :accountId)', { accountId })
      .orderBy('item.createdAt', 'DESC')
      .getMany();
  }

  async findLikedByAccount(accountId: string): Promise<Item[]> {
    return this.getItemQueryBuilder()
      .innerJoin('item.itemLikes', 'itemLikes')
      .where('itemLikes.accountId = :accountId', { accountId })
      .andWhere('item.status != :status', { status: ItemStatus.Draft })
      .orderBy('item.createdAt', 'DESC')
      .getMany();
  }

  async findById(itemId: string): Promise<Item> {
    return this.getItemQueryBuilder()
      .where('item.itemId = :itemId', { itemId })
      .andWhere('item.status != :status', { status: ItemStatus.Draft })
      .getOne();
  }

  async findDraftById(itemId: string): Promise<Item> {
    return this.getItemQueryBuilder()
      .where('item.itemId = :itemId', { itemId })
      .andWhere('item.status = :status', { status: ItemStatus.Draft })
      .getOne();
  }

  async findPriceRange(): Promise<PriceRangeDto> {
    const query = this.createQueryBuilder('item')
      .where('item.status = :status', {
        status: ItemStatus.Listed,
      })
      .andWhere('item.price IS NOT NULL');

    const cheapestQuery = query.clone().orderBy('item.price', 'ASC');
    const expensiveQuery = query.clone().orderBy('item.price', 'DESC');

    const { price: from } = await cheapestQuery.limit(1).getOneOrFail();
    const { price: to } = await expensiveQuery.limit(1).getOneOrFail();

    return { from: +from, to: +to };
  }

  async listAnItem(itemId: string, listId: number, price: string): Promise<void> {
    await this.update(
      {
        itemId,
      },
      { price, listId, status: ItemStatus.Listed, updatedAt: new Date() }
    );
  }

  async delistAnItem(itemId: string): Promise<void> {
    await this.update(
      {
        itemId,
      },
      { status: ItemStatus.NotListed, updatedAt: new Date() }
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

  async updateLikesOnItem(itemId: string, likes: number) {
    await this.update({ itemId }, { likes });
  }

  async pagination(paginationDto: ItemPaginationDto) {
    const { limit, skip, likesOrder } = paginationDto;

    const queryOptions = {
      relations: {
        image: true,
        owner: true,
        author: true,
        tags: true,
      },
      select: {
        image: { url: true },
        owner: { accountId: true, address: true },
        author: { accountId: true, address: true },
        tags: { name: true, id: true },
      },
      where: [] as FindOptionsWhere<Item>[],
      take: limit,
      skip: skip,
    } as FindManyOptions<Item>;

    const conditions = this.getPaginationConditions(paginationDto);

    queryOptions.where = conditions;

    if (likesOrder) {
      queryOptions.order = {
        likes: likesOrder,
      };
    }

    queryOptions.order = {
      ...queryOptions.order,
      createdAt: 'desc',
      tokenId: 'desc',
    };

    const [result, totalCount] = await this.findAndCount(queryOptions);

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      items: result,
    };
  }

  async createItem(itemRequest: DraftItemRequestDto, account: Account): Promise<Item> {
    const { name, collectionAddress, description, royalty } = itemRequest;

    const { accountId, address } = account;

    const tags = itemRequest.tags.map((tag) => {
      const newTag = new Tag();
      newTag.name = tag;
      return newTag;
    });

    const itemProperties = itemRequest.itemProperties.map((itemProp) => {
      const newProp = new ItemProperty();
      newProp.key = itemProp.key;
      newProp.value = itemProp.value;
      return newProp;
    });

    const item = this.create({
      collectionAddress,
      name,
      description,
      tags,
      itemProperties,
      royalty,
      author: new Account(accountId),
      owner: new Account(accountId),
    });

    await this.save(item);

    item.owner.address = address;
    item.author.address = address;

    return item;
  }

  async hasAccountLikedAnItem(accountId: string, itemId: string): Promise<boolean> {
    const number = await this.createQueryBuilder('item')
      .innerJoin('item.itemLikes', 'itemLike')
      .where('itemLike.accountId = :accountId', { accountId })
      .andWhere('item.itemId = :itemId', { itemId })
      .andWhere('item.status = :status', { status: ItemStatus.Listed })
      .getCount();

    return number > 0;
  }

  async activate(item: Item, itemRequest: ItemRequestDto): Promise<Item> {
    const { tokenId, image } = itemRequest;

    item.tokenId = tokenId;
    item.status = ItemStatus.NotListed;
    item.image = { url: image.url, cid: image.cid } as Image;

    const history = new History();
    history.transactionType = TransactionType.Minted;
    history.owner = new Account(item.author.accountId);

    item.history = [history];

    await this.save(item);
    return item;
  }

  private getPaginationConditions(paginationDto: ItemPaginationDto): FindOptionsWhere<Item>[] {
    const { priceFrom, priceTo, search } = paginationDto;
    const conditions = [] as FindOptionsWhere<Item>[];
    const condition1 = { status: ItemStatus.Listed } as FindOptionsWhere<Item>;

    if (priceFrom && priceTo) condition1.price = Between(String(priceFrom), String(priceTo));

    const condition2 = { ...condition1 };

    if (search) {
      condition1.name = Raw(
        (alias) => `LOWER(${alias}) Like '%${paginationDto.search?.toLowerCase()}%'`
      );

      condition2.description = Raw(
        (alias) => `LOWER(${alias}) Like '%${paginationDto.search?.toLowerCase()}%'`
      );
    }

    // This query will result on the following structure:
    // (status = 1 and price between x and y and name like '%value%') OR
    // (status = 1 and price between x and y and description like '%value%')
    conditions.push(condition1);
    conditions.push(condition2);

    return conditions;
  }
}
