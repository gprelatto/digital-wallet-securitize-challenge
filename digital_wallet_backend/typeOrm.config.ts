
import { DataSource } from 'typeorm';
import { Wallet } from './src/db/entities/wallet.entity';
import * as dotenv from 'dotenv';
import { getEnvPath } from './src/common/helper/env.helper';
import { Currency } from './src/db/entities/currency.entity';
import { ExchangeRate } from './src/db/entities/exchange-rate';
const envFilePath: string = getEnvPath('./src/common/envs');
dotenv.config({path: envFilePath});

export default new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    schema: process.env.DATABASE_SCHEMA,
    entities: [Wallet, Currency, ExchangeRate],
    migrations: ['./migrations/*'],
    migrationsTableName: process.env.DATABASE_MIGRATIONS_TABLE_NAME,
    logging: 'all',
    logger: 'file',
    synchronize: process.env.DATABASE_SYNC === "true",
    ssl:{
        rejectUnauthorized: process.env.REJECT_UNAUTHORIZED === "true"
    }
});