import { ItemProperty } from 'src/config/entities.config';

export type MigrationDraftItem = {
  name: string;
  description: string;
  royalty: number;
  price: string;
  rewards: number;
  tokenId: number;
};

export type MigrationItem = {
  name: number;
  rewards: number;
  price: string;
};

export type IpfsObjectResponse = {
  attributes: ItemProperty;
  image: string;
};
