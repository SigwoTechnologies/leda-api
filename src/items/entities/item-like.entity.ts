import { Account } from '../../account/entities/account.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class ItemLike {
  @PrimaryGeneratedColumn('uuid')
  itemLikeId: string;

  @ManyToOne(() => Item, (item) => item.itemLikes, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @ManyToOne(() => Account, (account) => account.itemLikes, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
