import { Collection } from '../entities/collection.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from '../dto/create-collection.dto';
import { Account } from '../../config/entities.config';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ItemRequestDto } from 'src/items/dto/item-request.dto';
import { CollectionImage } from '../entities/collection-image.entity';

@Injectable()
export class CollectionRepository extends Repository<Collection> {
  constructor(private dataSource: DataSource) {
    super(Collection, dataSource.createEntityManager());
  }

  async pagination(paginationDto: PaginationDto): Promise<Collection[] | undefined> {
    const { limit, skip } = paginationDto;

    const data = await this.find({
      relations: { items: true },
      take: limit,
      skip: skip,
    });

    if (!data) return;

    return data;
  }

  async findById(id: string): Promise<Collection | undefined> {
    const data = await this.findOne({
      where: { id },
      relations: {
        items: {
          image: true,
          owner: true,
          author: true,
        },
        owner: true,
      },
      select: {
        owner: {
          address: true,
        },
      },
    });

    if (!data) return;

    return data;
  }
  async findByName(name: string, account: Account): Promise<Collection | undefined> {
    const data = await this.findOne({
      where: { name, owner: new Account(account.accountId) },
    });

    if (!data) return;

    return data;
  }
  async getDefaultCollection(): Promise<Collection | undefined> {
    const data = await this.findOne({
      where: { name: process.env.DEFAULT_COLLECTION_NAME },
    });

    if (!data) return;

    return data;
  }

  async findByOwner(account: Account): Promise<Collection[] | undefined> {
    const data = await this.find({
      where: { owner: new Account(account.accountId) },
      relations: { items: true },
    });

    if (!data) return;

    return data;
  }
  async findCollectionsListByOwner(account: Account): Promise<Collection[] | undefined> {
    const data = await this.find({
      where: { owner: new Account(account.accountId) },
    });

    if (!data) return;

    return data;
  }

  async createCollection(
    { name, description }: CreateCollectionDto,
    owner: Account
  ): Promise<Collection> {
    const data = this.create({
      name,
      description,
      owner: new Account(owner.accountId),
    });

    await this.save(data);

    return data;
  }

  async activate(collection: Collection, { url, cid }: CollectionImage): Promise<Collection> {
    collection.image = {
      url,
      cid,
    } as CollectionImage;

    await this.save(collection);
    return collection;
  }
}
