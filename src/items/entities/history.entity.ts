import { Account } from 'src/config/entities.config';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  price: string;

  @Column()
  transactionType: string;

  @Column()
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
}
