import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import Jimp from 'jimp';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import { appConfig } from 'src/config/app.config';
import { items } from '../../jup-apes-migration/jups';
import { CreateCollectionDto } from '../../collections/dto/create-collection.dto';
import {
  Domain,
  IpfsObjectResponse,
  LogType,
  MigrationDraftItem,
  MigrationItem,
  types,
  Voucher,
} from '../../common/types/migration-types';
import { DraftItemRequestDto } from '../dto/draft-item-request.dto';
import { ItemPropertyDto } from '../dto/item-property.dto';
import { LazyItemRequestDto } from '../dto/lazy-item-request.dto';
import { Item } from '../entities/item.entity';
import { ItemService } from './item.service';
import { PinataService } from './pinata.service';
import { ethers } from 'ethers';
import { Account } from 'src/account/entities/account.entity';

@Injectable()
export class MigrationService {
  ADDRESS = process.env.MIGRATION_ADDRESS;
  ACCOUNT_ID = process.env.MIGRATION_ACCOUNT_ID;
  COLLECTION_ADDRESS = process.env.MIGRATION_COLLECTION_ADDRESS;
  PRIVATE_KEY = process.env.MIGRATION_PRIVATE_KEY;
  CHAIN_ID = +process.env.MIGRATION_CHAIN_ID;
  SIGNING_DOMAIN_NAME = 'LazyJups-Voucher';
  SIGNING_DOMAIN_VERSION = '1';
  ROYALTIES = 5;

  constructor(
    private pinataService: PinataService,
    private itemService: ItemService,
    private httpService: HttpService
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
/***********************************************************/
`;

    writeFileSync(logsRoute, template, {
      encoding: 'utf-8',
      flag: 'a',
    });
  }

  async init() {
    const responses = [];

    for (const [idx, item] of items.entries()) {
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
      address: this.ADDRESS,
      collection,
      collectionAddress: this.COLLECTION_ADDRESS,
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
    const response = await this.itemService.processLazyActivation(item, lazyItemRequest, {
      accountId: this.ACCOUNT_ID,
      address: this.ADDRESS,
    } as Account);
  }

  async createVoucher(
    uri: string,
    minPrice: string,
    stakingRewards: number,
    tokenId: number,
    royalties: number
  ): Promise<Voucher> {
    try {
      const signer = new ethers.Wallet(this.PRIVATE_KEY);
      console.log('signer|address', signer.address);
      const domain = await this.signingDomain();
      const voucher = { tokenId, minPrice, uri, royalties, stakingRewards };
      const signature = await signer._signTypedData(domain, types, voucher);

      return { ...voucher, signature } as Voucher;
    } catch (err) {
      console.log('createVoucher|exception', err);
    }
  }

  private async signingDomain(): Promise<Domain> {
    return {
      name: this.SIGNING_DOMAIN_NAME,
      version: this.SIGNING_DOMAIN_VERSION,
      verifyingContract: this.COLLECTION_ADDRESS,
      chainId: +this.CHAIN_ID,
    };
  }
}
