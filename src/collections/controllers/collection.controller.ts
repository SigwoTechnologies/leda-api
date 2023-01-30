import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Collection } from '../../collections/entities/collection.entity';
import { NewestItemsRequestDto } from '../../items/dto/newest-items-request.dto';
import { ItemPaginationDto } from '../../items/dto/pagination-request.dto';
import { PriceRangeDto } from '../../items/dto/price-range.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { CollectionPaginationDto } from '../dto/collection-pagination-request.dto';
import { EditCollectionDto } from '../dto/edit-collection.dto';
import { CollectionService } from '../services/collection.service';

@Controller('collections')
export class CollectionsController {
  constructor(private collectionService: CollectionService) {}

  @Public()
  @Get('/paginate')
  paginate(@Query() paginationDto: CollectionPaginationDto) {
    return this.collectionService.findPaginationCollection(paginationDto);
  }

  @Public()
  @Get('/newest')
  getNewest(@Query() NewestQuery: NewestItemsRequestDto) {
    return this.collectionService.getNewest(NewestQuery.qty);
  }

  @Public()
  @Get('/:id')
  getByName(@Param('id') id: string) {
    return this.collectionService.findById(id);
  }

  @Public()
  @Get('/:collectionId/items')
  getCollectionItems(
    @Param('collectionId') collectionId: string,
    @Query() paginationDto: ItemPaginationDto
  ) {
    return this.collectionService.findCollectionItems(collectionId, paginationDto);
  }

  @Public()
  @Get('/:collectionId/price-range')
  findPriceRange(@Param('collectionId') collectionId: string): Promise<PriceRangeDto> {
    return this.collectionService.findPriceRange(collectionId);
  }

  @Public()
  @Patch('/:collectionId')
  changeInformation(
    @Param('collectionId') collectionId: string,
    @Body() editCollectionDto: EditCollectionDto
  ): Promise<Collection> {
    return this.collectionService.changeInformation(collectionId, editCollectionDto);
  }
}
