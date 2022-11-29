import { ItemRepository } from './../../items/repositories/item.repository';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { BusinessException } from '../../common/exceptions/exception-types';
import { Collection } from '../entities/collection.entity';
import { CollectionRepository } from '../repositories/collection.repository';
import { CollectionPaginationDto } from '../dto/collection-pagination-request.dto';
import { Item } from 'src/config/entities.config';
import { ItemPaginationDto } from 'src/items/dto/pagination-request.dto';

@Injectable()
export class CollectionService {
  constructor(
    private collectionRepository: CollectionRepository,
    private accountRepository: AccountRepository,
    private itemsRepository: ItemRepository
  ) {}

  async findPaginationCollection(paginationValues: CollectionPaginationDto) {
    return this.collectionRepository.pagination(paginationValues);
  }

  async findById(id: string) {
    return this.collectionRepository.findById(id);
  }

  async findByOwner(address: string): Promise<Collection[]> {
    const account = await this.accountRepository.findByAddress(address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.collectionRepository.findByOwner(account);
  }

  async findCollectionsListByOwner(address: string): Promise<Collection[]> {
    const account = await this.accountRepository.findByAddress(address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.collectionRepository.findCollectionsListByOwner(account);
  }

  async findNftsOnCollection(id: string, filters: ItemPaginationDto) {
    const collection = await this.itemsRepository.nftsCollectionPagination(id, filters);

    if (!collection) throw new BusinessException(BusinessErrors.collection_not_associated);

    return collection;
  }
}
