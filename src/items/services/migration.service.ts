import { Injectable, StreamableFile } from '@nestjs/common';
import { AccountRepository } from '../../account/repositories/account.repository';
import { CollectionRepository } from '../../collections/repositories/collection.repository';
import { HistoryRepository } from '../repositories/history.repository';
import { ItemLikeRepository } from '../repositories/item-like.repository';
import { ItemRepository } from '../repositories/item.repository';
import { VoucherRepository } from '../repositories/voucher.repository';
import { createReadStream, readFile } from 'fs';
import { join } from 'path';

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
    for (let i = 0; i < Number(JUP_APES_TO_UPLOAD); i++) {
      const imageIdx = i + 1;
      // image path
      const image = `${join(process.cwd())}/${JUP_APES_DIRECTORY}/images/${imageIdx}.jpeg`;
    }

    // way to read the json data
    readFile(`${join(process.cwd())}/${JUP_APES_DIRECTORY}/jups.json`, 'utf-8', (err, data) => {
      if (err) throw err;
      console.log(data); // as string
      console.log(JSON.parse(data)); // as json
    });

    // way to return the json
    const file = createReadStream(`${join(process.cwd())}/${JUP_APES_DIRECTORY}/jups.json`);
    return new StreamableFile(file);

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
