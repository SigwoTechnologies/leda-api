import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get('/:itemId')
  findById(@Param('itemId') itemId: string): Promise<Item> {
    return this.itemService.findById(itemId);
  }

  @Post()
  create(@Body() itemRequestDto: ItemRequestDto): Promise<Item> {
    return this.itemService.create(itemRequestDto);
  }
}
