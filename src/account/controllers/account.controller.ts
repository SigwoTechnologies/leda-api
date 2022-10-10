import { Controller, Get, Param } from '@nestjs/common';
import { Item } from 'src/items/entities/item.entity';
import { ItemService } from 'src/items/services/item.service';

@Controller('accounts')
export class AccountsController {
  constructor(private itemService: ItemService) {}

  @Get('/:address/items')
  findItems(@Param('address') address: string): Promise<Item[]> {
    return this.itemService.findByAccount(address);
  }
}
