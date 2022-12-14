import { Injectable } from '@nestjs/common';
import fs from 'fs';
import Jimp from 'jimp';
import { join } from 'path';
import { CreateCollectionDto } from '../../collections/dto/create-collection.dto';
import {
  MigrationDraftItem,
  MigrationItem,
  IpfsObjectResponse,
} from '../../common/types/migration-types';
import { ITEMS } from 'src/jup-apes-migration/jups';
import { DraftItemRequestDto } from '../dto/draft-item-request.dto';
import { ItemPropertyDto } from '../dto/item-property.dto';
import { ItemProperty } from '../entities/item-property.entity';
import { ItemService } from './item.service';
import { PinataService } from './pinata.service';
import { HttpService } from '@nestjs/axios';
import { appConfig } from 'src/config/app.config';
import { firstValueFrom } from 'rxjs';
import { ItemRepository } from '../repositories/item.repository';
import { Item } from '../entities/item.entity';
import { LazyItemRequestDto } from '../dto/lazy-item-request.dto';
import { Collection } from 'src/config/entities.config';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { AccountRepository } from 'src/account/repositories/account.repository';

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

  async process() {
    const { JUP_APES_TO_UPLOAD } = process.env;

    // Go inside
    const { name, rewards, price } = ITEMS[0];

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
    const pinataResponse = await this.storeIpfsObject(ITEMS[1], draft.itemId);

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
    // console.log({ metadata });

    await this.activateItem(draft, {
      image: {
        cid,
        url,
      },
    } as LazyItemRequestDto);

    return pinataResponse;
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
    // console.log('draftItem', draftItem);
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
