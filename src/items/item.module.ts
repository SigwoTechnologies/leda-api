import { Module } from '@nestjs/common';
import { ItemsController } from './controllers/item.controller';
import { ItemService } from './services/item.service';
import { ItemRepository } from './repositories/item.repository';
import { AccountRepository } from 'src/account/repositories/account.repository';

@Module({
  imports: [],
  controllers: [ItemsController],
  providers: [ItemService, AccountRepository, ItemRepository],
})
export class ItemModule {}
