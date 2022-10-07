import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbProvider } from './common/providers/db.provider';
import { ItemModule } from './items/item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({ ...dbProvider }),
    AuthModule,
    ItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
