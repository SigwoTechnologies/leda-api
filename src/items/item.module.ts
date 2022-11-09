import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AccountRepository } from '../account/repositories/account.repository';
import { ImagesController } from './controllers/image.controller';
import { ItemsController } from './controllers/item.controller';
import { HistoryRepository } from './repositories/history.repository';
import { ItemRepository } from './repositories/item.repository';
import { PinataRepository } from './repositories/pinata.repository';
import { HistoryService } from './services/history.service';
import { ItemService } from './services/item.service';
import { PinataService } from './services/pinata.service';
import { TagsRepository } from './repositories/tags.repository';

@Module({
  imports: [HttpModule],
  controllers: [ItemsController, ImagesController],
  providers: [
    ItemService,
    PinataService,
    HistoryService,
    HistoryRepository,
    AccountRepository,
    PinataRepository,
    ItemRepository,
    TagsRepository,
  ],
  exports: [ItemService, HistoryService],
})
export class ItemModule {}
