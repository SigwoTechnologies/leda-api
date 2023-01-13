import { Controller, Get, Param, Query, Patch, Body } from '@nestjs/common';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsAddressValid } from '../../auth/decorators/address.decorator';
import { Collection } from '../../collections/entities/collection.entity';
import { CollectionService } from '../../collections/services/collection.service';
import { Item } from '../../items/entities/item.entity';
import { ItemService } from '../../items/services/item.service';
import { EditAccountDto } from '../dto/edit-account.dto';
import { AccountService } from '../services/account.service';
@Controller('accounts')
export class AccountsController {
  constructor(
    private itemService: ItemService,
    private collectionService: CollectionService,
    private accountService: AccountService
  ) {}

  @IsAddressValid()
  @Get('/:address/items')
  findItems(
    @Param('address') address: string,
    @Query() paginationDto: PaginationDto
  ): Promise<Item[]> {
    return this.itemService.findByAddress(address, paginationDto);
  }

  @IsAddressValid()
  @Get('/:address/collections')
  findCollections(@Param('address') address: string): Promise<Collection[]> {
    return this.collectionService.findByOwner(address);
  }

  @IsAddressValid()
  @Get('/:address/collections-list')
  findCollectionsList(@Param('address') address: string): Promise<Collection[]> {
    return this.collectionService.findCollectionsListByOwner(address);
  }

  @IsAddressValid()
  @Get('/:address/liked-items')
  findLikedItems(
    @Param('address') address: string,
    @Query() paginationDto: PaginationDto
  ): Promise<Item[]> {
    return this.itemService.findLikedByAddress(address, paginationDto);
  }

  @IsAddressValid()
  @Patch('/:address')
  changeInformation(@Param('address') address: string, @Body() editAccountDto: EditAccountDto) {
    return this.accountService.changeInformation(address, editAccountDto);
  }
}
