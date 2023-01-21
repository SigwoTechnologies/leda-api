import { Item } from '../../items/entities/item.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { History } from '../../items/entities/history.entity';
import { ItemLike } from '../../items/entities/item-like.entity';
import { Voucher } from '../../items/entities/voucher.entity';
import { Collection } from '../../collections/entities/collection.entity';
import { Image } from '../../items/entities/image.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  accountId: string;

  @Column({ unique: true, nullable: false })
  address: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @OneToMany(() => Item, (item) => item.owner, { cascade: true })
  items: Item[];

  @OneToMany(() => History, (table) => table.item, { cascade: true })
  history: History[];

  @OneToMany(() => ItemLike, (table) => table.item, { cascade: true })
  itemLikes: ItemLike[];

  @OneToMany(() => Voucher, (voucher) => voucher.author, { cascade: true })
  vouchers: Voucher[];

  @OneToMany(() => Collection, (table) => table.owner, { cascade: true })
  collections: Collection[];

  @OneToOne(() => Image, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: true,
  })
  @JoinColumn({ name: 'backgroundId' })
  background: Image;

  @OneToOne(() => Image, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: true,
  })
  @JoinColumn({ name: 'pictureId' })
  picture: Image;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor(id: string) {
    this.accountId = id;
  }
}
