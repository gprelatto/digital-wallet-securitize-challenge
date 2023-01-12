import { Currency } from '@/db/entities/currency.entity';
import { ExchangeRate } from '@/db/entities/exchange-rate';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/db/entities/wallet.entity';
import { RateController } from '../controller/rate.controller';
import { ExchangeRateRepository } from '../repository/rate.repository';
import { ExchangeRateService } from '../service/rate.service';


@Module({
  imports: [TypeOrmModule.forFeature([Currency,ExchangeRate])],
  controllers: [RateController],
  providers: [ExchangeRateService,ExchangeRateRepository],
  exports:[ExchangeRateService]
})
export class RateModule {}