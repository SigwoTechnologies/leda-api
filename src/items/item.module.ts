import { Module } from '@nestjs/common';
import { ItemsController } from './controllers/item.controller';
import { ItemService } from './services/item.service';
import { ItemRepository } from './repositories/item.repository';
import { AccountRepository } from '../account/repositories/account.repository';
import { PinataService } from './services/pinata.service';
import { ImagesController } from './controllers/image.controller';
import { HttpModule } from '@nestjs/axios';
import { PinataRepository } from './repositories/pinata.repository';
import { HistoryService } from './services/history.service';
import { HistoryRepository } from './repositories/history.repository';
import { HistoryController } from './controllers/history.controller';

@Module({
  imports: [HttpModule],
  controllers: [ItemsController, ImagesController, HistoryController],
  providers: [
    ItemService,
    PinataService,
    HistoryService,
    AccountRepository,
    PinataRepository,
    ItemRepository,
    HistoryRepository,
  ],
  exports: [ItemService, HistoryService],
})
export class ItemModule {}
