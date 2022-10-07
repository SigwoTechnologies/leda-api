import { Max, MaxLength, Min } from 'class-validator';
import { Account } from 'src/account/entities/account.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemStatus } from '../enums/item-status.enum';
import { Image } from './image.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column({ unique: true })
  tokenId: number;

  @Column()
  collectionAddress: string;

  @Column()
  @MaxLength(100)
  name: string;

  @Column()
  description: string;

  @Column()
  @Min(0)
  price: number;

  @Column()
  @Min(0)
  @Max(10)
  royalty: number;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.NotListed,
  })
  status: ItemStatus;

  @ManyToOne(() => Account, (account) => account.items, {
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

  @Column()
  likes: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
