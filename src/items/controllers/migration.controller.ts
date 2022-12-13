import { Controller, Get, Post } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { ItemPropertyDto } from '../dto/item-property.dto';
import { Item } from '../entities/item.entity';
import { HistoryService } from '../services/history.service';
import { ItemService } from '../services/item.service';

type JupApeType = {
  name: string;
  description: string;
  itemProperties: JupApeProps[];
  price: string;
  royalty: number;
};

type JupApeProps = {
  key: string;
  value: string;
};

type MigrationRequest = {
  apes: JupApeType[];
};

@Controller('migration')
export class MigrationController {
  constructor(private itemService: ItemService, private historyService: HistoryService) {}

  @Public()
  @Post()
  start(): Promise<Item[]> {
    return this.itemService.findAll();
  }
}
