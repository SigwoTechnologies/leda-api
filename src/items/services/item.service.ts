import { Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/account/repositories/account.repository';
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

  async findNewest(): Promise<Item[]> {
    return this.itemRepository.findNewest();
  }

  async create(itemRequestDto: ItemRequestDto): Promise<Item> {
    // TODO: Validate that the JWT address and the given address corresponds
    // TODO: Validate that the given collection address (nft collection address) corresponds to the given nft's collection address

    const accountId = await this.accountRepository.findByAddress(itemRequestDto.address);

    if (!accountId) throw new Error('The given address does not have an associated account.');

    return this.itemRepository.createItem(itemRequestDto, accountId);
  }
}
