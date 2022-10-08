import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  imageId: string;

  @Column()
  url: string;

  @Column()
  cid: string;

  @OneToOne(() => Item, (item) => item.image)
  item: Item;
}
