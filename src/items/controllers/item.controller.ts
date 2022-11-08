import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IsAddressValid } from '../../auth/decorators/address.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { BuyRequestDto } from '../dto/buy-request.dto';
import { ItemRequestDto } from '../dto/item-request.dto';
import { ItemPaginationDto } from '../dto/pagination-request.dto';
import { ListItemRequestDto } from '../dto/list-item-request.dto';
import { SearchRequestDto } from '../dto/search-request.dto';
import { History } from '../entities/history.entity';
import { Item } from '../entities/item.entity';
import { HistoryService } from '../services/history.service';
import { ItemService } from '../services/item.service';
import { NotFoundException } from '../../common/exceptions/exception-types';
@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemService, private historyService: HistoryService) {}

  @Public()
  @Get()
  findAll(@Query() paginationDto: ItemPaginationDto) {
    return this.itemService.findPagination(paginationDto);
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
  @Get('/history')
  findAllHistory(): Promise<History[]> {
    return this.historyService.findAll();
  }

  @Public()
  @Get(':itemId/history')
  findAllByItemId(@Param('itemId') itemId: string): Promise<History[]> {
    return this.historyService.findAllByItemId(itemId);
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
  buyItem(@Param('itemId') itemId: string, @Body() buyRequestDto: BuyRequestDto): Promise<Item> {
    buyRequestDto.itemId = itemId;
    return this.itemService.buyItem(buyRequestDto);
  }

  @Post('/:itemId/price')
  listAnItem(
    @Param('itemId') itemId: string,
    @Body() listItemRequestDto: ListItemRequestDto
  ): Promise<Item> {
    listItemRequestDto.itemId = itemId;
    return this.itemService.listAnItem(listItemRequestDto);
  }
}
