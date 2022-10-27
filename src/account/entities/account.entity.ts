import { Item } from '../../items/entities/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  accountId: string;

  @Column({ unique: true, nullable: false })
  address: string;

  @OneToMany(() => Item, (item) => item.owner, { cascade: true })
  items: Item[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor(id: string) {
    this.accountId = id;
  }
}
