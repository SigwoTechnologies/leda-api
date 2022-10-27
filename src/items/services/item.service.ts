import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { BusinessException, NotFoundException } from '../../common/exceptions/exception-types';
import { Injectable } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { ItemRepository } from '../repositories/item.repository';
import { ItemRequestDto } from '../dto/item-request.dto';

@Injectable()
export class ItemService {
  constructor(
    private itemRepository: ItemRepository,
    private accountRepository: AccountRepository
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemRepository.findAll();
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

    return this.itemRepository.createItem(itemRequestDto, account.accountId);
  }

  async listAnItem(itemId: string, price: number): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new NotFoundException(`The item with id ${itemId} does not exist`);

    await this.itemRepository.listAnItem(itemId, price);

    return item;
  }
}
