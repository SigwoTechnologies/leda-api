import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagsRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  async findAll(): Promise<Tag[]> {
    return this.find({
      relations: ['item', 'owner', 'item.image'],
    });
  }

  async findAllByItemId(itemId: string): Promise<Tag[]> {
    return this.find({
      where: {
        item: new Item(itemId),
      },
      relations: ['item'],
    });
  }

  async createTag({ tags, itemId }: { tags: string[]; itemId: string }): Promise<void> {
    await Promise.all(
      tags.map(async (tag) => {
        const data = this.create({
          name: tag,
          item: new Item(itemId),
        });

        await this.save(data);
      })
    );
  }
}
