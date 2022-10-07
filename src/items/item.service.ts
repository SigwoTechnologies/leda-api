import { Injectable } from '@nestjs/common';
import { ItemDto } from './item.dto';
import { Item } from './item.entity';
import { ItemRepository } from './item.repository';

@Injectable()
export class ItemService {
  constructor(private itemRepository: ItemRepository) {}

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async create(itemDto: ItemDto): Promise<Item> {
    return this.itemRepository.createItem(itemDto);
  }
}
