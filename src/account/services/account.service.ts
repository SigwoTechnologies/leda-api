import { Injectable } from '@nestjs/common';
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

  async findByAddress(address: string) {
    return this.accountRepository.findByAddress(address);
  }

  async changeInformation(address: string, editAccountDto: EditAccountDto): Promise<Account> {
    const account = await this.accountRepository.findByAddress(address);

    return this.accountRepository.changeInformation(account, editAccountDto);
  }
}
