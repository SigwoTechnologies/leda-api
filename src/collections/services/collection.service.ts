import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { BusinessException } from '../../common/exceptions/exception-types';
import { CreateCollectionDto } from '../dto/create-collection.dto';
import { Collection } from '../entities/collection.entity';
import { CollectionRepository } from '../repositories/collection.repository';

@Injectable()
export class CollectionService {
  constructor(
    private collectionRepository: CollectionRepository,
    private accountRepository: AccountRepository
  ) {}

  async create(collection: CreateCollectionDto): Promise<Collection> {
    const account = await this.accountRepository.findByAddress(collection.ownerAddress);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.collectionRepository.createCollection(collection, account);
  }
  async findPagination(paginationValues: PaginationDto) {
    return this.collectionRepository.pagination(paginationValues);
  }

  async findByOwner(address: string): Promise<Collection[]> {
    return this.collectionRepository.findByOwner(address);
  }
}
