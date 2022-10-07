import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(private dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }

  async findByAddress(address: string): Promise<string | undefined> {
    const response = await this.createQueryBuilder('account')
      .select('account.accountId')
      .where('account.address = :address', { address })
      .getOne();

    if (!response) return;

    return response.accountId;
  }
}
