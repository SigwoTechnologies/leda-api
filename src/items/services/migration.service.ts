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

  async saveLogs(name: string, status: boolean, errorInfo: unknown) {
    const logsRoute = `${join(process.cwd())}/migration-logs.txt`;

    const template = `
    JupApe #${name}:
      name: JupApe ${name}
      success: ${status}
      errorInfo: ${errorInfo}
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
      // this.saveLogs(idx, String(item.name), true);
      console.log(`Call for item ${idx}`);
    }

    const start = performance.now();
    await Promise.allSettled(responses)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    const end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
    console.log(ITEMS.length);
  }

  async process(item: MigrationItem) {
    const { JUP_APES_TO_UPLOAD } = process.env;

    // Go inside
    const { name, rewards, price } = item;

    const itemName = `JUP Ape N°${name}`;

    const draft = await this.storeDraftItem({
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

    const url = await this.getIpfsMetadata(cid);
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

    // console.log(pinataResponse);
    console.log({ url });

    await this.activateItem(draft, {
      image: {
        cid,
        url,
      },
    } as LazyItemRequestDto);

    return pinataResponse;
  }

  async storeDraftItem(draft: MigrationDraftItem) {
    try {
      // if (draft.name === 'JUP Ape N°2') throw new Error('Wrong');
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
      // console.log('draftItem', draftItem);
      this.saveLogs(draft.name, true, '');
      return draftItem;
    } catch (error) {
      console.log(error);
      this.saveLogs(
        draft.name,
        false,
        `Error: item #${draft.name}. Message: ${error.message}. Stack: ${error.stack} `
      );
    }
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

  async getIpfsMetadata(cid: string) {
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
