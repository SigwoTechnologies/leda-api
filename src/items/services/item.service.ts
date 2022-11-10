import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { BusinessException, NotFoundException } from '../../common/exceptions/exception-types';
import { Injectable } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { ItemRepository } from '../repositories/item.repository';
import { ItemRequestDto } from '../dto/item-request.dto';
import { ItemPaginationDto } from '../dto/pagination-request.dto';
import { ItemStatus } from '../enums/item-status.enum';
import { HistoryRepository } from '../repositories/history.repository';
import { TransactionType } from '../enums/transaction-type.enum';
import { ListItemRequestDto } from '../dto/list-item-request.dto';
import { BuyRequestDto } from '../dto/buy-request.dto';
import { PriceRangeDto } from '../dto/price-range.dto';
import { DelistItemRequestDto } from '../dto/delist-item-request.dto';

@Injectable()
export class ItemService {
  constructor(
    private itemRepository: ItemRepository,
    private accountRepository: AccountRepository,
    private historyRepository: HistoryRepository
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }

  async findPagination(paginationValues: ItemPaginationDto) {
    return this.itemRepository.pagination(paginationValues);
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

  async findPriceRange(): Promise<PriceRangeDto> {
    return this.itemRepository.findPriceRange();
  }

  async create(itemRequestDto: ItemRequestDto): Promise<Item> {
    const account = await this.accountRepository.findByAddress(itemRequestDto.address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    const item = await this.itemRepository.createItem(itemRequestDto, account);

    await this.historyRepository.createHistory({
      itemId: item.itemId,
      accountId: account.accountId,
      transactionType: TransactionType.Minted,
    });

    return item;
  }

  async buyItem({ itemId, address: newOwnerAddress }: BuyRequestDto): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new NotFoundException(`The item with id ${itemId} does not exist`);

    const account = await this.accountRepository.findByAddress(newOwnerAddress);
    if (!account)
      throw new NotFoundException(`The account with address ${newOwnerAddress} does not exist`);

    await this.itemRepository.buyItem(itemId, account.accountId);

    item.owner.address = account.address;
    item.status = ItemStatus.Sold;

    await this.historyRepository.createHistory({
      itemId,
      price: item.price,
      accountId: account.accountId,
      transactionType: TransactionType.Sold,
      listId: item.listId,
    });

    return item;
  }

  async listAnItem({ address, itemId, listId, price }: ListItemRequestDto): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new NotFoundException(`The item with id ${itemId} does not exist`);

    const account = await this.accountRepository.findByAddress(address);
    if (!account) throw new NotFoundException(`The account with address ${address} does not exist`);

    await this.itemRepository.listAnItem(itemId, listId, price);

    item.price = price;
    item.listId = listId;
    item.status = ItemStatus.Listed;

    await this.historyRepository.createHistory({
      itemId,
      price,
      accountId: account.accountId,
      transactionType: TransactionType.Listed,
      listId,
    });

    return item;
  }

  async delistAnItem({ itemId, address }: DelistItemRequestDto): Promise<Item> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new NotFoundException(`The item with id ${itemId} does not exist`);

    const account = await this.accountRepository.findByAddress(address);
    if (!account) throw new NotFoundException(`The account with address ${address} does not exist`);

    await this.itemRepository.delistAnItem(itemId);

    await this.historyRepository.createHistory({
      itemId,
      accountId: account.accountId,
      transactionType: TransactionType.Delisted,
      listId: item.listId,
    });

    item.status = ItemStatus.NotListed;

    return item;
  }
}
