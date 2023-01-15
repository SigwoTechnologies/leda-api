import { Injectable } from '@nestjs/common';
import { BusinessErrors } from '../../common/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { BusinessException } from '../../common/exceptions/exception-types';
import { Item } from '../../items/entities/item.entity';
import { CollectionRepository } from '../../collections/repositories/collection.repository';
import { ItemRepository } from '../../items/repositories/item.repository';
import { EditAccountDto } from '../dto/edit-account.dto';
import { Account } from '../entities/account.entity';
import { AccountRepository } from '../repositories/account.repository';

@Injectable()
export class AccountService {
  constructor(
    private collectionRepository: CollectionRepository,
    private accountRepository: AccountRepository,
    private itemsRepository: ItemRepository
  ) {}

  async findAccountByAddress(address: string) {
    return this.accountRepository.findByAddress(address);
  }

  async findCreatedItemsByAddress(address: string, paginationDto: PaginationDto) {
    const account = await this.accountRepository.findByAddress(address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.itemsRepository.findCreatedByAccount(account.accountId, paginationDto);
  }
  async findOnSaleItemsByAddress(address: string, paginationDto: PaginationDto) {
    const account = await this.accountRepository.findByAddress(address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.itemsRepository.findOnSaleByAccount(account.accountId, paginationDto);
  }

  async findOwnedItemsByAddress(address: string, paginationDto: PaginationDto) {
    const account = await this.accountRepository.findByAddress(address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.itemsRepository.findOwnedByAccount(account.accountId, paginationDto);
  }

  async findLikedByAddress(address: string, paginationDto: PaginationDto): Promise<Item[]> {
    const account = await this.accountRepository.findByAddress(address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.itemsRepository.findLikedByAccount(account.accountId, paginationDto);
  }

  async changeInformation(address: string, editAccountDto: EditAccountDto): Promise<Account> {
    const account = await this.accountRepository.findByAddress(address);

    return this.accountRepository.changeInformation(account, editAccountDto);
  }
}
