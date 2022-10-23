import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsAddressValid } from 'src/auth/decorators/address.decorator';
import { Item } from '../entities/item.entity';
import { ItemRequestDto } from '../dto/item-request.dto';
import { ItemService } from '../services/item.service';
import { Public } from 'src/auth/decorators/public.decorator';
@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemService) {}

  @Public()
  @Get()
  findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get('/:itemId')
  findById(@Param('itemId') itemId: string): Promise<Item> {
    return this.itemService.findById(itemId);
  }

  @IsAddressValid()
  @Post()
  create(@Body() itemRequestDto: ItemRequestDto): Promise<Item> {
    return this.itemService.create(itemRequestDto);
  }
}
