import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { HistoryRequestDto } from '../dto/history-request.dto';
import { History } from '../entities/history.entity';
import { HistoryService } from '../services/history.service';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Public()
  @Get('items')
  findAll(): Promise<History[]> {
    return this.historyService.findAll();
  }

  @Public()
  @Get('items/:itemId')
  findAllByItemId(@Param('itemId') itemId: string): Promise<History[]> {
    return this.historyService.findAllByItemId(itemId);
  }

  @Public()
  @Post('items')
  create(@Body() historyRequestDto: HistoryRequestDto): Promise<History> {
    return this.historyService.createHistory(historyRequestDto);
  }
}
