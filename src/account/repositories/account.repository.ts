import { Account } from '../entities/account.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EditAccountDto } from '../dto/edit-account.dto';
import { formatImageUrl } from 'src/common/utils/image-utils';
import { Image } from 'src/config/entities.config';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(private dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }

  async findByAddress(address: string): Promise<Account | undefined> {
    const account = await this.createQueryBuilder('account')
      .where('account.address = :address', { address: address.toLocaleLowerCase() })
      .getOne();

    if (!account) return;

    return account;
  }

  async changeInformation(account: Account, editAccountDto: EditAccountDto): Promise<Account> {
    account.background =
      account.background &&
      ({
        url: formatImageUrl(editAccountDto.background.url),
        cid: editAccountDto.background.cid,
      } as Image);

    account.picture =
      account.background &&
      ({
        url: formatImageUrl(editAccountDto.picture.url),
        cid: editAccountDto.picture.cid,
      } as Image);

    account.username = editAccountDto.username;

    return this.save(account);
  }
}
