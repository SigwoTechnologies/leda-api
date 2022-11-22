import { Account } from '../../account/entities/account.entity';
import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { BusinessException, NotFoundException } from '../../common/exceptions/exception-types';
import { BuyRequestDto } from '../dto/buy-request.dto';
import { DelistItemRequestDto } from '../dto/delist-item-request.dto';
import { HistoryRepository } from '../repositories/history.repository';
import { Injectable } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { ItemLikeRepository } from '../repositories/item-like.repository';
import { ItemPaginationDto } from '../dto/pagination-request.dto';
import { ItemRepository } from '../repositories/item.repository';
import { ItemStatus } from '../enums/item-status.enum';
import { ListItemRequestDto } from '../dto/list-item-request.dto';
import { PriceRangeDto } from '../dto/price-range.dto';
import { TransactionType } from '../enums/transaction-type.enum';
import { DraftItemRequestDto } from '../dto/draft-item-request.dto';
import { ItemRequestDto } from '../dto/item-request.dto';

@Injectable()
export class ItemService {
  constructor(
    private itemRepository: ItemRepository,
    private accountRepository: AccountRepository,
    private historyRepository: HistoryRepository,
    private itemLikeRepository: ItemLikeRepository
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }

  async getNewest(qty: number): Promise<Item[]> {
    const maxToSearch = 15;
    if (qty > maxToSearch) throw new BusinessException(BusinessErrors.newest_tohigh_number);
    if (qty === 0) throw new BusinessException(BusinessErrors.newest_zero_notallowed);

    return this.itemRepository.getNewest(qty);
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

  async findLikedByAddress(address: string): Promise<Item[]> {
    const account = await this.accountRepository.findByAddress(address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.itemRepository.findLikedByAccount(account.accountId);
  }

  async findPriceRange(): Promise<PriceRangeDto> {
    return this.itemRepository.findPriceRange();
  }

  async create(itemRequest: DraftItemRequestDto): Promise<Item> {
    const account = await this.accountRepository.findByAddress(itemRequest.address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    return this.itemRepository.createItem(itemRequest, account);
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

    item.history = await this.historyRepository.findAllByItemId(item.itemId);

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

    item.history = await this.historyRepository.findAllByItemId(item.itemId);

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

    item.history = await this.historyRepository.findAllByItemId(item.itemId);

    return item;
  }

  async like(itemId: string, address: string): Promise<Item> {
    const itemToLike = await this.itemRepository.findById(itemId);
    const history = await this.historyRepository.findAllByItemId(itemId);

    if (!itemToLike) throw new NotFoundException(`The item with id ${itemId} does not exist`);

    const account = await this.accountRepository.findByAddress(address);
    if (!account) throw new NotFoundException(`The account with address ${address} does not exist`);

    const currentLikes = await this.itemLikeRepository.getTotalOfLikesFromItem(itemId);

    const hasAccountLiked = await this.itemRepository.hasAccountLikedAnItem(
      account.accountId,
      itemId
    );

    if (hasAccountLiked) {
      await this.itemLikeRepository.delete({
        item: new Item(itemId),
        account: new Account(account.accountId),
      });

      itemToLike.likes = currentLikes - 1;
    } else {
      await this.itemLikeRepository.createItemLike(itemId, account.accountId);

      itemToLike.likes = currentLikes + 1;
    }
    await this.itemRepository.updateLikesOnItem(itemId, itemToLike.likes);

    const item = { ...itemToLike, history };
    return item;
  }

  async activate(itemId: string, itemRequest: ItemRequestDto): Promise<Item> {
    const account = await this.accountRepository.findByAddress(itemRequest.address);

    if (!account) throw new BusinessException(BusinessErrors.address_not_associated);

    const item = await this.itemRepository.findDraftById(itemId);
    if (!item) throw new NotFoundException(`The item with id ${itemId} does not exist`);

    return this.itemRepository.activate(item, itemRequest);
  }
}
