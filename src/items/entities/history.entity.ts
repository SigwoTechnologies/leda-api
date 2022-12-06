import { Account } from '../../account/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  price: string;

  @Column()
  transactionType: string;

  @Column({ nullable: true })
  listId: number;

  @ManyToOne(() => Account, (table) => table.history, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: Account;

  @ManyToOne(() => Item, (table) => table.history, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;
}
