import { Module } from '@nestjs/common';
import { ItemsController } from './item.controller';
import { ItemService } from './item.service';
import { ItemRepository } from './item.repository';

@Module({
  imports: [],
  controllers: [ItemsController],
  providers: [ItemService, ItemRepository],
})
export class ItemModule {}
