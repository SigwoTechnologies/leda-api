import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../account/repositories/account.repository';
import { NotFoundException } from '../../common/exceptions/exception-types';
import { HistoryRequestDto } from '../dto/history-request.dto';
import { History } from '../entities/history.entity';
import { HistoryRepository } from '../repositories/history.repository';
import { ItemRepository } from '../repositories/item.repository';

@Injectable()
export class HistoryService {
  constructor(
    private itemRepository: ItemRepository,
    private historyRepository: HistoryRepository,
    private accountRepository: AccountRepository
  ) {}

  async findAllByItemId(itemId: string): Promise<History[]> {
    return this.historyRepository.findAllByItemId(itemId);
  }

  async createHistory(historyRequestDto: HistoryRequestDto): Promise<History> {
    const item = await this.itemRepository.findById(historyRequestDto.itemId);
    if (!item)
      throw new NotFoundException(`The item with id ${historyRequestDto.itemId} does not exist`);

    const account = await this.accountRepository.findByAddress(historyRequestDto.accountAddress);
    if (!account)
      throw new NotFoundException(
        `The account with id ${historyRequestDto.accountAddress} does not exist`
      );

    historyRequestDto.accountId = account.accountId;

    return this.historyRepository.createHistory(historyRequestDto);
  }
}
