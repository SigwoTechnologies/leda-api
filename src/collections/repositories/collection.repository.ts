import { Collection } from '../entities/collection.entity';
import { DataSource, FindManyOptions, FindOptionsWhere, Raw, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CollectionResponseDto, CreateCollectionDto } from '../dto/create-collection.dto';
import { Account } from '../../config/entities.config';
import { CollectionPaginationDto } from '../dto/collection-pagination-request.dto';

@Injectable()
export class CollectionRepository extends Repository<Collection> {
  constructor(private dataSource: DataSource) {
    super(Collection, dataSource.createEntityManager());
  }

  async pagination(
    paginationDto: CollectionPaginationDto
  ): Promise<CollectionResponseDto | undefined> {
    const { limit, skip, collectionId, creationOrder, mintType } = paginationDto;

    const queryOptions = {
      relations: {
        items: {
          image: true,
        },
        owner: true,
      },
      take: limit,
      skip: skip,
    } as FindManyOptions<Collection>;

    const conditions = this.getPaginationConditions(paginationDto);

    queryOptions.where = conditions;

    if (collectionId) {
      queryOptions.where = {
        id: collectionId,
      };
    }

    if (creationOrder) {
      queryOptions.order = {
        createdAt: creationOrder,
      };
    }

    queryOptions.order = {
      ...queryOptions.order,
      id: 'desc',
    };

    const [result, totalCount] = await this.findAndCount(queryOptions);

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      collections: result,
    };
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

  private getPaginationConditions(
    paginationDto: CollectionPaginationDto
  ): FindOptionsWhere<Collection>[] {
    const { search } = paginationDto;
    const conditions = [] as FindOptionsWhere<Collection>[];
    const condition1 = {} as FindOptionsWhere<Collection>;
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
