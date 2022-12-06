import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AccountRepository } from '../account/repositories/account.repository';
import { ImagesController } from './controllers/image.controller';
import { ItemsController } from './controllers/item.controller';
import { VouchersController } from './controllers/voucher.controller';
import { HistoryRepository } from './repositories/history.repository';
import { ItemLikeRepository } from './repositories/item-like.repository';
import { ItemRepository } from './repositories/item.repository';
import { PinataRepository } from './repositories/pinata.repository';
import { VoucherRepository } from './repositories/voucher.repository';
import { HistoryService } from './services/history.service';
import { ItemService } from './services/item.service';
import { PinataService } from './services/pinata.service';
import { VoucherService } from './services/voucher.service';

@Module({
  imports: [HttpModule],
  controllers: [ItemsController, ImagesController, VouchersController],
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
    VoucherService,
  ],
  exports: [ItemService, HistoryService],
})
export class ItemModule {}
