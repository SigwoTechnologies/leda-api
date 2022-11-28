import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AccountRepository } from '../account/repositories/account.repository';
import { ImagesController } from './controllers/image.controller';
import { ItemsController } from './controllers/item.controller';
import { HistoryRepository } from './repositories/history.repository';
import { ItemLikeRepository } from './repositories/item-like.repository';
import { ItemRepository } from './repositories/item.repository';
import { PinataRepository } from './repositories/pinata.repository';
import { VoucherRepository } from './repositories/voucher.repository';
import { HistoryService } from './services/history.service';
import { ItemService } from './services/item.service';
import { PinataService } from './services/pinata.service';

@Module({
  imports: [HttpModule],
  controllers: [ItemsController, ImagesController],
  providers: [
    AccountRepository,
    HistoryRepository,
    HistoryService,
    ItemLikeRepository,
    ItemRepository,
    ItemService,
    PinataRepository,
    PinataService,
    VoucherRepository,
  ],
  exports: [ItemService, HistoryService],
})
export class ItemModule {}
