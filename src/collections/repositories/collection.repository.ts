import { Collection } from '../entities/collection.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CollectionResponseDto, CreateCollectionDto } from '../dto/create-collection.dto';
import { Account } from '../../config/entities.config';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CollectionRepository extends Repository<Collection> {
  constructor(private dataSource: DataSource) {
    super(Collection, dataSource.createEntityManager());
  }

  async pagination(paginationDto: PaginationDto): Promise<CollectionResponseDto | undefined> {
    const { limit, skip } = paginationDto;

    const queryOptions = {
      relations: { items: true },
      take: limit,
      skip: skip,
    };

    const [result, totalCount] = await this.findAndCount(queryOptions);

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      collections: result,
    };

    /* const data = await this.find({
      relations: { items: true },
      take: limit,
      skip: skip,
    });

    if (!data) return;

    return data; */
  }

  async findById(id: string): Promise<Collection | undefined> {
    const data = await this.findOne({
      where: { id },
      relations: { items: true },
    });

    if (!data) return;

    return data;
  }
  async findByName(name: string): Promise<Collection | undefined> {
    const data = await this.findOne({
      where: { name },
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
}
