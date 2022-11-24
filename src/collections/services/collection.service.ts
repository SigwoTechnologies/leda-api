import { Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/account/repositories/account.repository';
import { BusinessErrors } from 'src/common/constants';
import { BusinessException } from 'src/common/exceptions/exception-types';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Collection } from '../entities/collection.entity';
import { CollectionRepository } from '../repositories/collection.repository';

@Injectable()
export class CollectionService {
  constructor(
    private collectionRepository: CollectionRepository,
    private accountRepository: AccountRepository
  ) {}

  async findPagination(paginationValues: PaginationDto) {
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
