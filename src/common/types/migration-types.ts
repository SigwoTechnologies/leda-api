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
  description: string;
};

export type LogType = {
  name: string;
  status: boolean;
  errorInfo: unknown;
  cid: string;
  itemId: string;
};

export type IpfsObjectResponse = {
  attributes: ItemProperty;
  image: string;
};

export type Voucher = {
  minPrice: string;
  uri: string;
  royalties: number;
  signature: string;
  tokenId: number;
  stakingRewards: number;
};

export type Domain = {
  name: string;
  version: string;
  verifyingContract: string;
  chainId: number;
};

export const types = {
  NFTVoucher: [
    { name: 'tokenId', type: 'uint256' },
    { name: 'minPrice', type: 'uint256' },
    { name: 'uri', type: 'string' },
    { name: 'royalties', type: 'uint256' },
    { name: 'stakingRewards', type: 'uint256' },
  ],
};
