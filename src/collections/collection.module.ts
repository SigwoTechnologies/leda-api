import { CollectionRepository } from './repositories/collection.repository';
import { CollectionsController } from './controllers/collection.controller';
import { ItemModule } from '../items/item.module';
import { Module } from '@nestjs/common';
import { CollectionService } from './services/collection.service';
import { AccountRepository } from '../account/repositories/account.repository';
import { ItemRepository } from '../items/repositories/item.repository';

@Module({
  imports: [ItemModule],
  controllers: [CollectionsController],
  providers: [CollectionRepository, AccountRepository, CollectionService, ItemRepository],
  exports: [CollectionRepository, CollectionService],
})
export class CollectionModule {}
