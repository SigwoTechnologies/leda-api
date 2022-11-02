import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IsAddressValid } from '../../auth/decorators/address.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { BuyRequestDto } from '../dto/buy-request.dto';
import { ItemRequestDto } from '../dto/item-request.dto';
import { PaginationRequestDto } from '../dto/pagination-request.dto';
import { ListItemRequestDto } from '../dto/list-item-request.dto';
import { SearchRequestDto } from '../dto/search-request.dto';
import { Item } from '../entities/item.entity';
import { ItemService } from '../services/item.service';
import { NotFoundException } from '../../common/exceptions/exception-types';
@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemService) {}

  @Public()
  @Get()
  findAll(
    @Query()
    { limit, likesOrder, priceFrom, priceTo }: PaginationRequestDto
  ) {
    const notLimitMessage = 'Please provide a limit';
    if (!limit) throw new NotFoundException(notLimitMessage);
    const paginationValues: PaginationRequestDto = {
      limit,
      likesOrder,
      priceFrom,
      priceTo,
    };
    return this.itemService.findPagination(paginationValues);
  }

  @Public()
  @Get('/search')
  search(@Query() { topic }: SearchRequestDto) {
    const notTopicMessage = 'Please provide a topic to search';
    if (!topic) throw new NotFoundException(notTopicMessage);
    const topicValue: SearchRequestDto = {
      topic,
    };
    return this.itemService.search(topicValue);
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
