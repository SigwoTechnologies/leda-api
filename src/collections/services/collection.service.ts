import { Injectable } from '@nestjs/common';
import { ItemPaginationDto } from '../../items/dto/pagination-request.dto';
import { PriceRangeDto } from '../../items/dto/price-range.dto';
import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { BusinessException } from '../../common/exceptions/exception-types';
import { CollectionPaginationDto } from '../dto/collection-pagination-request.dto';
import { EditCollectionDto } from '../dto/edit-collection.dto';
import { Collection } from '../entities/collection.entity';
import { CollectionRepository } from '../repositories/collection.repository';
import { ItemRepository } from './../../items/repositories/item.repository';

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

  async getNewest(qty: number) {
    const { totalCount, collections } = await this.collectionRepository.getNewest(qty);
    for await (const collection of collections) {
      collection.items = await this.itemsRepository.getNewestByCollection(collection.id, 1);
    }
    return {
      totalCount,
      collections,
    };
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

  async findCollectionItems(id: string, filters: ItemPaginationDto) {
    const collection = await this.itemsRepository.collectionItems(id, filters);

    if (!collection) throw new BusinessException(BusinessErrors.collection_not_associated);

    return collection;
  }

  async findPriceRange(collectionId: string): Promise<PriceRangeDto> {
    return this.itemsRepository.findPriceRangeCollectionItems(collectionId);
  }

  async changeInformation(
    collectionId: string,
    editCollectionDto: EditCollectionDto
  ): Promise<Collection> {
    const collection = await this.collectionRepository.findById(collectionId);

    return this.collectionRepository.changeInformation(collection, editCollectionDto);
  }
}
