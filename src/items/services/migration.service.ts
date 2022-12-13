import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../account/repositories/account.repository';
import { CollectionRepository } from '../../collections/repositories/collection.repository';
import { Item } from '../entities/item.entity';
import { HistoryRepository } from '../repositories/history.repository';
import { ItemLikeRepository } from '../repositories/item-like.repository';
import { ItemRepository } from '../repositories/item.repository';
import { VoucherRepository } from '../repositories/voucher.repository';

@Injectable()
export class ItemService {
  constructor(
    private itemRepository: ItemRepository,
    private accountRepository: AccountRepository,
    private historyRepository: HistoryRepository,
    private itemLikeRepository: ItemLikeRepository,
    private voucherRepository: VoucherRepository,
    private collectionRepository: CollectionRepository
  ) {}

  async process(): Promise<void> {
    // TODO:
    // Get bonuses file
    // Create jup ape schema
    // Loop over jup apes
    // Store on ipfs
    // Generate voucher
    // Store voucher
    // Things to take into account:
    // Retry strategy
    // Exception handling
    // Parameterize number range?
  }
}
