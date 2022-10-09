import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemRequestDto } from '../dto/item-request.dto';
import { Item } from '../entities/item.entity';
import { ItemService } from '../services/item.service';

@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemService) {}

  @Get()
  findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get('/newest')
  findNewestItems(): Promise<Item[]> {
    return this.itemService.findNewest();
  }

  @Post()
  create(@Body() itemRequestDto: ItemRequestDto): Promise<Item> {
    return this.itemService.create(itemRequestDto);
  }
}
