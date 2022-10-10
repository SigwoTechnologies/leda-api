import { Module } from '@nestjs/common';
import { ItemsController } from './controllers/item.controller';
import { ItemService } from './services/item.service';
import { ItemRepository } from './repositories/item.repository';
import { AccountRepository } from 'src/account/repositories/account.repository';
import { PinataService } from './services/pinata.service';
import { ImagesController } from './controllers/image.controller';
import { HttpModule } from '@nestjs/axios';
import { PinataRepository } from './repositories/pinata.repository';

@Module({
  imports: [HttpModule],
  controllers: [ItemsController, ImagesController],
  providers: [ItemService, PinataService, AccountRepository, PinataRepository, ItemRepository],
  exports: [ItemService],
})
export class ItemModule {}
