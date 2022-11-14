import { IpfsAttribute } from './ipfs-attribute';

export type IpfsObject = {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: IpfsAttribute[];
};
