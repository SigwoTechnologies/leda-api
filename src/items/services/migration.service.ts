import { Injectable, StreamableFile } from '@nestjs/common';
import { AccountRepository } from '../../account/repositories/account.repository';
import { CollectionRepository } from '../../collections/repositories/collection.repository';
import { HistoryRepository } from '../repositories/history.repository';
import { ItemLikeRepository } from '../repositories/item-like.repository';
import { ItemRepository } from '../repositories/item.repository';
import { VoucherRepository } from '../repositories/voucher.repository';
import * as fs from 'fs';
import { join } from 'path';
import * as jsonData from '../../jup-apes-migration/jups.json';
import { fileURLToPath } from 'url';

@Injectable()
export class MigrationService {
  constructor(
    private itemRepository: ItemRepository,
    private accountRepository: AccountRepository,
    private historyRepository: HistoryRepository,
    private itemLikeRepository: ItemLikeRepository,
    private voucherRepository: VoucherRepository,
    private collectionRepository: CollectionRepository
  ) {}

  async process() {
    const { JUP_APES_DIRECTORY, JUP_APES_TO_UPLOAD } = process.env;

    // get images from an interval
    // for (let i = 0; i < Number(JUP_APES_TO_UPLOAD); i++) {
    //   const imageIdx = i + 1;
    //   // image path
    // }
    const file = fs.readFileSync(join(process.cwd(), './images/1188254.jpg'));

    console.log(file);
    // console.log(jsonData);

    return jsonData;

    // TODO:
    // Get bonuses file
    // Create jup ape schema
    // Loop over jup apes
    // Store on ipfs
    // Generate voucher
    // Store voucher
    // Things to take into account:
    // Retry strategy
    // Exception handling
    // Parameterize number range?
  }
}
