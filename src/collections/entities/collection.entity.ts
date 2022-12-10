import { Account } from '../../config/entities.config';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { Image } from '../../items/entities/image.entity';
import { Max } from 'class-validator';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @Max(255)
  description: string;

  @Column({ unique: false, nullable: false })
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

  @OneToOne(() => Image, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: true,
  })
  @JoinColumn({ name: 'imageId' })
  image: Image;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(id: string) {
    this.id = id;
  }
}
