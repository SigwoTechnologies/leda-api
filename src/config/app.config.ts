import { constants } from '../common/constants';
import { getMetadataArgsStorage } from 'typeorm';

export const appConfig = () => ({
  [constants.database]: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
    synchronize: process.env.POSTGRES_SYNC, // IMPORTANT: Turn this off on Production
    timezone: 'Z',
    extra: {
      // ssl: {
      //   rejectUnauthorized: false,
      // },
    },
  },
  pinataUrl: process.env.PINATA_URL || '',
  pinataGatewayUrl: process.env.PINATA_GATEWAY_URL || '',
  pinataApiKey: process.env.PINATA_API_KEY || '',
  pinataApiSecret: process.env.PINATA_API_SECRET || '',
  nonceTimeExpirationInMiliseconds: 120000,
});
