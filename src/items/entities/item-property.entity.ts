import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class ItemProperty {
  @PrimaryGeneratedColumn('uuid')
  itemPropertyId: string;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => Item, (table) => table.itemProperties, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;
}
