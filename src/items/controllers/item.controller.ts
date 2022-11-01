import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IsAddressValid } from '../../auth/decorators/address.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { BuyRequestDto } from '../dto/buy-request.dto';
import { ItemRequestDto } from '../dto/item-request.dto';
import { ListItemRequestDto } from '../dto/list-item-request.dto';
import { Item } from '../entities/item.entity';
import { ItemService } from '../services/item.service';
@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemService) {}

  @Public()
  @Get()
  findAll(
    @Query()
    {
      limit,
      page,
      likesOrder,
      priceFrom,
      priceTo,
    }: {
      limit: number;
      page: number;
      likesOrder: 'asc' | 'desc';
      priceFrom: number;
      priceTo: number;
    }
  ): Promise<Item[]> {
    if (limit || page)
      return this.itemService.findPagination(limit, page, likesOrder, priceFrom, priceTo);
    return this.itemService.findAll();
  }

  @Public()
  @Get('/:itemId')
  findById(@Param('itemId') itemId: string): Promise<Item> {
    return this.itemService.findById(itemId);
  }

  @IsAddressValid()
  @Post()
  create(@Body() itemRequestDto: ItemRequestDto): Promise<Item> {
    return this.itemService.create(itemRequestDto);
  }

  @Post('/:itemId/buy')
  buyItem(@Param('itemId') itemId: string, @Body() { address }: BuyRequestDto): Promise<Item> {
    return this.itemService.buyItem(itemId, address);
  }

  @Post('/:itemId/price')
  listAnItem(
    @Param('itemId') itemId: string,
    @Body() { price, listId }: ListItemRequestDto
  ): Promise<Item> {
    return this.itemService.listAnItem(itemId, listId, price);
  }
}
