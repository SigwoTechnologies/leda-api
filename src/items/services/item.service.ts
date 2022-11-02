import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { BusinessException, NotFoundException } from '../../common/exceptions/exception-types';
import { Injectable } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { ItemRepository } from '../repositories/item.repository';
import { ItemRequestDto } from '../dto/item-request.dto';
import { SearchRequestDto } from '../dto/search-request.dto';
import { PaginationRequestDto } from '../dto/pagination-request.dto';
import { ItemStatus } from '../enums/item-status.enum';

@Injectable()
export class ItemService {
  constructor(
    private itemRepository: ItemRepository,
    private accountRepository: AccountRepository
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }

  async findPagination(paginationValues: PaginationRequestDto) {
    return this.itemRepository.pagination(paginationValues);
  }

  async search(topicValue: SearchRequestDto) {
    return this.itemRepository.search(topicValue);
  }

  async findById(itemId: string): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);

    if (!item) throw new NotFoundException(`The item with id ${itemId} does not exist`);

    return item;
  }

  async findByAddress(address: string): Promise<Item[]> {
    const account = await this.accountRepository.findByAddress(address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.itemRepository.findByAccount(account.accountId);
  }

  async create(itemRequestDto: ItemRequestDto): Promise<Item> {
    const account = await this.accountRepository.findByAddress(itemRequestDto.address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.itemRepository.createItem(itemRequestDto, account);
  }

  async buyItem(itemId: string, newOwnerAddress: string): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new NotFoundException(`The item with id ${itemId} does not exist`);

    const account = await this.accountRepository.findByAddress(newOwnerAddress);
    if (!account)
      throw new NotFoundException(`The account with address ${newOwnerAddress} does not exist`);

    await this.itemRepository.buyItem(itemId, account.accountId);

    item.owner.address = account.address;
    item.status = ItemStatus.NotListed;

    return item;
  }

  async listAnItem(itemId: string, listId: number, price: string): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new NotFoundException(`The item with id ${itemId} does not exist`);

    await this.itemRepository.listAnItem(itemId, listId, price);

    item.price = price;
    item.listId = listId;
    item.status = ItemStatus.Listed;

    return item;
  }
}
