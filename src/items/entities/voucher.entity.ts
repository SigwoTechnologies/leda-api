import { Account } from '../../account/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  voucherId: string;

  @Column()
  minPrice: string;

  @Column()
  uri: string;

  @OneToOne(() => Item, (table) => table.voucher, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @ManyToOne(() => Account, (account) => account.vouchers, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'authorId' })
  author: Account;

  @Column()
  royalties: number;

  @Column()
  signature: string;

  @Column({ nullable: true })
  tokenId: number;

  @Column({ default: 0 })
  stakingRewards: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(id: string) {
    this.voucherId = id;
  }
}
