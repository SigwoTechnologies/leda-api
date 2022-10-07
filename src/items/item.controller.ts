import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemDto } from './item.dto';
import { Item } from './item.entity';
import { ItemService } from './item.service';

@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemService) {}

  @Get()
  findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Post()
  create(@Body() itemDto: ItemDto): Promise<Item> {
    return this.itemService.create(itemDto);
  }
}
