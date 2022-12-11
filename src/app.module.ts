import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbProvider } from './common/providers/db.provider';
import { ItemModule } from './items/item.module';
import { AccountModule } from './account/account.module';
import { PagerMiddleware } from './common/middlewares/pager.middleware';
import { CollectionModule } from './collections/collection.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRootAsync({ ...dbProvider }),
    AuthModule,
    ItemModule,
    AccountModule,
    CollectionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PagerMiddleware).forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
