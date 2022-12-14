import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import Jimp from 'jimp';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import { AccountRepository } from 'src/account/repositories/account.repository';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { appConfig } from 'src/config/app.config';
import { ITEMS } from '../../jup-apes-migration/jup';
import { CreateCollectionDto } from '../../collections/dto/create-collection.dto';
import {
  IpfsObjectResponse,
  LogType,
  MigrationDraftItem,
  MigrationItem,
} from '../../common/types/migration-types';
import { DraftItemRequestDto } from '../dto/draft-item-request.dto';
import { ItemPropertyDto } from '../dto/item-property.dto';
import { LazyItemRequestDto } from '../dto/lazy-item-request.dto';
import { Item } from '../entities/item.entity';
import { ItemRepository } from '../repositories/item.repository';
import { ItemService } from './item.service';
import { PinataService } from './pinata.service';

const address = '0x9b7920fb94533b0bfbf12914c09b8b22230b6041';
const collectionAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

@Injectable()
export class MigrationService {
  constructor(
    private pinataService: PinataService,
    private itemService: ItemService,
    private itemRepository: ItemRepository,
    private httpService: HttpService,
    private collectionRepository: CollectionRepository,
    private accountRepository: AccountRepository
  ) {}

  async saveLogs(log: LogType) {
    const { name, status, errorInfo, cid, itemId } = log;
    const logsRoute = `${join(process.cwd())}/migration-logs.txt`;

    const template = `
/******************** ITEM: ${name} ********************/
Item: itemId: ${itemId}
IPFS: cid: ${cid}
Success: ${status}
Exception: ${errorInfo}
/****************************************************/
`;

    writeFileSync(logsRoute, template, {
      encoding: 'utf-8',
      flag: 'a',
    });
  }

  async init() {
    const responses = [];

    for (const [idx, item] of ITEMS.entries()) {
      const responsePromise = this.process(item);
      responses.push(responsePromise);
      console.log(`Call for item ${idx + 1}`);
    }

    const start = performance.now();
    const proccesedPromises = await Promise.allSettled(responses);

    proccesedPromises.map((prom) => {
      const { status } = prom;
      let log: LogType;
      if (status === 'fulfilled') {
        const { value: item } = prom;
        log = {
          itemId: item.itemId,
          cid: item.image.cid,
          errorInfo: 'none',
          name: item.name,
          status: true,
        } as LogType;
      } else {
        const { reason } = prom;
        const jsonReason = JSON.parse(reason.message);

        log = {
          name: `JUP Ape N°${jsonReason.name}`,
          itemId: jsonReason.itemId,
          cid: 'none',
          errorInfo: jsonReason.error,
          status: false,
        } as LogType;
      }

      this.saveLogs(log);
    });
    const end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
  }

  async process(item: MigrationItem) {
    let draft: Item;
    try {
      const { JUP_APES_TO_UPLOAD } = process.env;

      // Go inside
      const { name, rewards, price } = item;

      const itemName = `JUP Ape N°${name}`;

      draft = await this.storeDraftItem({
        name: itemName,
        description: itemName,
        royalty: 5,
        price,
        rewards,
        tokenId: name,
      });

      // Store IPFS
      const pinataResponse = await this.storeIpfsObject(item, draft.itemId);

      const { IpfsHash: cid } = pinataResponse;

      const url = await this.getIpfsMetadata(item.name, cid);
      // Get Json Object

      // Get IPFS Metadata
      // Generate vouchers
      // Activate draft items

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

      console.log({ url });

      await this.activateItem(draft, {
        image: {
          cid,
          url,
        },
      } as LazyItemRequestDto);

      return draft;
    } catch (error) {
      const errorBody = {
        name: item.name,
        error: `${error.message}. - ${error.stack}`,
        itemId: draft.itemId,
      };
      throw new Error(JSON.stringify(errorBody));
    }
  }

  async storeDraftItem(draft: MigrationDraftItem) {
    const collection = { name: 'JupApeNFT' } as CreateCollectionDto;
    const tags = ['JUP APE'];

    const itemProperties = [
      { key: 'rewards', value: draft.rewards },
      { key: 'royalty', value: draft.royalty },
      { key: 'tokenId', value: draft.tokenId.toString() },
    ] as ItemPropertyDto[];

    const request = {
      address,
      collection,
      collectionAddress,
      name: draft.name,
      description: draft.description,
      price: draft.price,
      royalty: draft.royalty,
      tags,
      itemProperties,
    } as DraftItemRequestDto;

    const draftItem = await this.itemService.create(request);

    return draftItem;
  }

  async storeIpfsObject(migrationItem: MigrationItem, itemId: string) {
    const { name, rewards } = migrationItem;
    const itemName = `JUP Ape N°${name}`;

    const { buffer, mime, extension } = await Jimp.read(`images/${name}.jpeg`).then(
      async (image) => {
        return {
          mime: image.getMIME(),
          extension: image.getExtension(),
          buffer: await image.getBufferAsync(image.getMIME()),
        };
      }
    );

    const attributes = {
      'reserved::name': itemName,
      'reserved::description': itemName,
      'reserved::external_url': `http://localhost:3000/item/${itemId}`, // TODO: Pull prod environment here
      rewards,
      royalty: '5', // This value is fixed
      tokenId: name,
    };

    const pinataResponse = await this.pinataService.uploadRaw(
      buffer,
      `${name}.${extension}`,
      mime,
      attributes
    );
    return pinataResponse;
  }

  async getIpfsMetadata(name: number, cid: string) {
    const { pinataGatewayUrl } = appConfig();

    const { data } = await firstValueFrom(
      this.httpService.get<IpfsObjectResponse>(`${pinataGatewayUrl}/${cid}`)
    );
    return data.image;
  }

  async activateItem(item: Item, lazyItemRequest: LazyItemRequestDto) {
    const account = await this.accountRepository.findByAddress(address);
    const collection = await this.collectionRepository.findByName('JupApeNFT', account);
    this.itemRepository.activateLazyItem(item, lazyItemRequest, collection);
  }
}
