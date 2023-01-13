import { AccountModule } from '../account/account.module';
import { AddressGuard } from './guards/address.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountService } from 'src/account/services/account.service';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { ItemRepository } from 'src/items/repositories/item.repository';

@Module({
  imports: [
    AccountModule,
    ConfigModule,
    PassportModule,
    CacheModule.register(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AddressGuard,
    },
    AccountService,
    CollectionRepository,
    ItemRepository,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
