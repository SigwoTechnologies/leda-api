import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CollectionRepository } from '../collections/repositories/collection.repository';
import { AccountRepository } from '../account/repositories/account.repository';
import { ImagesController } from './controllers/image.controller';
import { ItemsController } from './controllers/item.controller';
import { MigrationController } from './controllers/migration.controller';
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
import { MigrationService } from './services/migration.service';

@Module({
  imports: [HttpModule],
  controllers: [ItemsController, ImagesController, VouchersController, MigrationController],
  providers: [
    AccountRepository,
    HistoryRepository,
    HistoryService,
    ItemLikeRepository,
    ItemRepository,
    ItemService,
    PinataRepository,
    PinataService,
    MigrationService,
    VoucherRepository,
    VoucherService,
    CollectionRepository,
  ],
  exports: [ItemService, HistoryService, ItemRepository],
})
export class ItemModule {}
