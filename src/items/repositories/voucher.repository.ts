import { Account } from '../../account/entities/account.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { LazyItemRequestDto } from '../dto/lazy-item-request.dto';
import { Voucher } from '../entities/voucher.entity';

@Injectable()
export class VoucherRepository extends Repository<Voucher> {
  constructor(private dataSource: DataSource) {
    super(Voucher, dataSource.createEntityManager());
  }

  async findVoucherByItemId(itemId: string) {
    return this.findOne({
      where: { item: new Item(itemId) },
      relations: { author: true },
      select: { author: { address: true } },
    });
  }

  async createVoucher(
    item: Item,
    lazyItemRequest: LazyItemRequestDto,
    account: Account
  ): Promise<Voucher> {
    const voucher = this.create({
      minPrice: lazyItemRequest.minPrice,
      uri: lazyItemRequest.image.url,
      author: new Account(account.accountId),
      royalties: lazyItemRequest.royalties,
      signature: lazyItemRequest.signature,
      item,
    });

    await this.save(voucher);
    voucher.author.address = account.address;

    return voucher;
  }

  async deleteVoucher(accountId: string, itemId: string): Promise<void> {
    this.delete({
      item: new Item(itemId),
      author: new Account(accountId),
    });
  }
}
