import { Injectable } from '@nestjs/common';
import { getAverage } from '../../common/utils/average-item-likes-utils';
import { ItemStatus } from '../../items/enums/item-status.enum';
import { DataSource, FindManyOptions, FindOptionsWhere, Not, Raw, Repository } from 'typeorm';
import { Account } from '../../config/entities.config';
import { CollectionPaginationDto } from '../dto/collection-pagination-request.dto';
import { CollectionResponseDto, CreateCollectionDto } from '../dto/create-collection.dto';
import { CollectionImage } from '../entities/collection-image.entity';
import { Collection } from '../entities/collection.entity';

@Injectable()
export class CollectionRepository extends Repository<Collection> {
  constructor(private dataSource: DataSource) {
    super(Collection, dataSource.createEntityManager());
  }

  async getNewest(qty: number): Promise<{ totalCount: number; collections: Collection[] }> {
    const queryOptions = {
      relations: {
        owner: true,
        image: true,
      },
      select: {
        owner: {
          address: true,
        },
      },
      take: qty,
    } as unknown as FindManyOptions<Collection>;

    const [collections, totalCount] = await this.findAndCount(queryOptions);

    return {
      totalCount,
      collections,
    };
  }

  async pagination(
    paginationDto: CollectionPaginationDto
  ): Promise<CollectionResponseDto | undefined> {
    const { limit, skip, creationOrder, mintType, popularityOrder } = paginationDto;

    const queryOptions = {
      relations: {
        owner: true,
        image: true,
        items: true,
      },
      select: {
        owner: {
          address: true,
        },
        items: true,
      },
      where: {
        items: {
          status: Not(ItemStatus.Hidden),
        },
      },
      take: limit,
      skip: skip,
    } as FindManyOptions<Collection>;

    let conditions: FindOptionsWhere<Collection>[];
    if (paginationDto.search) conditions = this.getPaginationConditions(paginationDto);

    queryOptions.where = conditions;

    // TODO: Uncomment this code when the Lazy Minting feature is done
    /* if (mintType) {
      queryOptions.where = {
        items: {
          type: mintType,
        },
      };
    } */

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

    let collectionsRes: Collection[];

    const collectionPopularity = result.map((res) => {
      const orderedNfts = getAverage(res.items);
      return { ...res, popularity: orderedNfts };
    });

    collectionsRes = collectionPopularity;

    if (popularityOrder) {
      collectionsRes = collectionPopularity.sort((a, b) => {
        if (popularityOrder === 'asc') return a.popularity - b.popularity;
        if (popularityOrder === 'desc') return b.popularity - a.popularity;
      });
    }
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      collections: collectionsRes,
    };
  }

  async findById(id: string): Promise<Collection | undefined> {
    const data = await this.findOne({
      where: { id },
      relations: {
        owner: true,
        image: true,
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
    createCollectionDto: CreateCollectionDto,
    owner: Account
  ): Promise<Collection> {
    const data = this.create({
      name: createCollectionDto.name,
      description: createCollectionDto.description,
      owner: new Account(owner.accountId),
    });

    data.image = {
      url: createCollectionDto.image.url,
      cid: createCollectionDto.image.cid,
    } as CollectionImage;

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

    conditions.push(condition1);
    conditions.push(condition2);

    return conditions;
  }
}
