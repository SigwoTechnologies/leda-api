import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { constants } from '../constants';

export const dbProvider = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    ...configService.get<TypeOrmModuleAsyncOptions>(constants.database),
  }),
};
