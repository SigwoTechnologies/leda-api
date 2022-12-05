import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.entity';

@Entity()
export class CollectionImage {
  @PrimaryGeneratedColumn('uuid')
  imageId: string;

  @Column()
  url: string;

  @Column()
  cid: string;

  @OneToOne(() => Collection, (table) => table.image)
  collection: Collection;
}
