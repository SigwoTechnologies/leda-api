import { Account } from '../../config/entities.config';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from '../../items/entities/item.entity';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => Item, (table) => table.collection, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  items: Item[];

  @ManyToOne(() => Account, (table) => table.collections, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(id: string) {
    this.id = id;
  }
}
