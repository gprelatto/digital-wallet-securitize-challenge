import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { Currency } from './entities/currency.entity';
import { ExchangeRate } from './entities/exchange-rate';

@Injectable()
export class DbModule implements TypeOrmOptionsFactory {
    @Inject(ConfigService)
    private readonly config: ConfigService;

    public createTypeOrmOptions(): TypeOrmModuleOptions {
        return{ 
            type: 'postgres',
            host: this.config.get('DATABASE_HOST'),
            port: this.config.get('DATABASE_PORT'),
            username: this.config.get('DATABASE_USER'),
            password: this.config.get('DATABASE_PASSWORD'),
            database: this.config.get('DATABASE_NAME'),
            schema: this.config.get('DATABASE_SCHEMA'),
            entities: [Wallet, Currency, ExchangeRate],
            synchronize: this.config.get('DATABASE_SYNC') === "true",
            logging: true,
            retryAttempts: 0,
            ssl:{
                rejectUnauthorized: this.config.get('REJECT_UNAUTHORIZED') === "true"
            }
        }
    }
};