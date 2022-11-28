import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { BusinessException } from '../../common/exceptions/exception-types';
import { Collection } from '../entities/collection.entity';
import { CollectionRepository } from '../repositories/collection.repository';
import { CollectionPaginationDto } from '../dto/collection-pagination-request.dto';

@Injectable()
export class CollectionService {
  constructor(
    private collectionRepository: CollectionRepository,
    private accountRepository: AccountRepository
  ) {}

  async findPagination(paginationValues: CollectionPaginationDto) {
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
}
