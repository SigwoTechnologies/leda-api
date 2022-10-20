import { AccountRepository } from './repositories/account.repository';
import { AccountsController } from './controllers/account.controller';
import { ItemModule } from 'src/items/item.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ItemModule],
  controllers: [AccountsController],
  providers: [AccountRepository],
  exports: [AccountRepository],
})
export class AccountModule {}
