import { Controller, Get, Query, Param } from '@nestjs/common';
import { ItemPaginationDto } from 'src/items/dto/pagination-request.dto';
import { PriceRangeDto } from 'src/items/dto/price-range.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { CollectionPaginationDto } from '../dto/collection-pagination-request.dto';
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
  @Get('/:id')
  getByName(@Param('id') id: string) {
    return this.collectionService.findById(id);
  }

  @Public()
  @Get('/:id/paginate')
  paginateNfts(@Param('id') id: string, @Query() paginationDto: ItemPaginationDto) {
    return this.collectionService.findNftsOnCollection(id, paginationDto);
  }

  @Public()
  @Get('/:collectionId/price-range')
  findPriceRange(@Param('collectionId') collectionId: string): Promise<PriceRangeDto> {
    return this.collectionService.findPriceRange(collectionId);
  }
}
