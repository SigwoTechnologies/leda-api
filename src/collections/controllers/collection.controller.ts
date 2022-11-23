import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsAddressValid } from '../../auth/decorators/address.decorator';
import { CreateCollectionDto } from '../dto/create-collection.dto';
import { CollectionService } from '../services/collection.service';

@Controller('collections')
export class CollectionsController {
  constructor(private collectionService: CollectionService) {}

  @Public()
  @Get('/paginate')
  paginate(@Query() paginationDto: PaginationDto) {
    return this.collectionService.findPagination(paginationDto);
  }

  @IsAddressValid()
  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }
}
