import { Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/account/repositories/account.repository';
import { constants } from 'src/common/constants';
import { BusinessException } from 'src/common/exceptions/exception-types';
import { ItemRequestDto } from '../dto/item-request.dto';
import { Item } from '../entities/item.entity';
import { ItemRepository } from '../repositories/item.repository';

@Injectable()
export class ItemService {
  constructor(
    private itemRepository: ItemRepository,
    private accountRepository: AccountRepository
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }

  async findByAccount(address: string): Promise<Item[]> {
    const accountId = await this.accountRepository.findByAddress(address);

    if (!accountId)
      throw new BusinessException(constants.errors.business_exception.address_not_associated);

    return this.itemRepository.findByAccount(accountId);
  }

  async create(itemRequestDto: ItemRequestDto): Promise<Item> {
    // TODO: Validate that the JWT address and the given address corresponds
    // TODO: Validate that the given collection address (nft collection address) corresponds to the given nft's collection address

    const accountId = await this.accountRepository.findByAddress(itemRequestDto.address);

    if (accountId)
      throw new BusinessException(constants.errors.business_exception.address_not_associated);

    return this.itemRepository.createItem(itemRequestDto, accountId);
  }
}
