import { Module } from '@nestjs/common';
import { ItemModule } from 'src/items/item.module';
import { AccountsController } from './controllers/account.controller';

@Module({
  imports: [ItemModule],
  controllers: [AccountsController],
})
export class AccountModule {}
