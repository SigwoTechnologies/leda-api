import { Collection } from '../entities/collection.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from '../dto/create-collection.dto';
import { Account } from '../../config/entities.config';
import { PaginationDto } from '../../common/dto/pagination.dto';

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
    });

    if (!data) return;

    return data;
  }

  async findByOwner(address: string): Promise<Collection[] | undefined> {
    const data = await this.find({
      where: { owner: new Account(address) },
      relations: { items: true },
    });

    if (!data) return;

    return data;
  }

  async createCollection(
    { name, address }: CreateCollectionDto,
    owner: Account
  ): Promise<Collection> {
    const data = this.create({
      name,
      address,
      owner: new Account(owner.accountId),
    });

    await this.save(data);

    return data;
  }
}
