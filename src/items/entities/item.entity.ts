import { Max, MaxLength, Min } from 'class-validator';
import { Account } from '../../account/entities/account.entity';
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
import { ItemStatus } from '../enums/item-status.enum';
import { Image } from './image.entity';
import { History } from './history.entity';
import { Tag } from './tag.entity';
import { ItemLike } from './item-like.entity';
import { ItemProperty } from './item-property.entity';
import { Collection } from '../../collections/entities/collection.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  // TODO: !IMPORTANT: MAKE THIS FIELD UNIQUE ONCE IN PROD
  @Column({ unique: false, nullable: true })
  tokenId: number;

  // TODO: !IMPORTANT: MAKE THIS FIELD UNIQUE ONCE IN PROD
  @Column({ unique: false, nullable: true })
  listId: number;

  @OneToMany(() => Tag, (table) => table.item, { cascade: true })
  tags: Tag[];

  @Column()
  @MaxLength(100)
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  collectionAddress: string;

  @Column({ nullable: true })
  price: string;

  @Column()
  @Min(0)
  @Max(10)
  royalty: number;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.Draft,
  })
  status: ItemStatus;

  @ManyToOne(() => Account, (account) => account.items, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'authorId' })
  author: Account;

  @ManyToOne(() => Account, (account) => account.items, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: Account;

  @ManyToOne(() => Collection, (table) => table.items, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'collectionId' })
  collection: Collection;

  @OneToOne(() => Image, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: true,
  })
  @JoinColumn({ name: 'imageId' })
  image: Image;

  @Column({ default: 0 })
  likes: number;

  @OneToMany(() => History, (table) => table.item, { cascade: true })
  history: History[];

  @OneToMany(() => ItemLike, (table) => table.item, { cascade: true })
  itemLikes: ItemLike[];

  @OneToMany(() => ItemProperty, (table) => table.item, { cascade: true })
  itemProperties: ItemProperty[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(id: string) {
    this.itemId = id;
  }
}
