import { Item } from '../../items/entities/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { History } from 'src/items/entities/history.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  accountId: string;

  @Column({ unique: true, nullable: false })
  address: string;

  @OneToMany(() => Item, (item) => item.owner, { cascade: true })
  items: Item[];

  @OneToMany(() => History, (table) => table.owner, { cascade: true })
  history: History[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor(id: string) {
    this.accountId = id;
  }
}
