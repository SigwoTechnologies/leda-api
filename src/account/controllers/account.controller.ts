import { Controller, Get, Param } from '@nestjs/common';
import { IsAddressValid } from '../../auth/decorators/address.decorator';
import { Item } from '../../items/entities/item.entity';
import { ItemService } from '../../items/services/item.service';
@Controller('accounts')
export class AccountsController {
  constructor(private itemService: ItemService) {}

  @IsAddressValid()
  @Get('/:address/items')
  findItems(@Param('address') address: string): Promise<Item[]> {
    return this.itemService.findByAddress(address);
  }

  @IsAddressValid()
  @Get('/:address/liked-items')
  findLikedItems(@Param('address') address: string): Promise<Item[]> {
    return this.itemService.findLikedByAddress(address);
  }
}
