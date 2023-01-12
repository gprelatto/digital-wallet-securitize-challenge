import { Module } from '@nestjs/common';
import { RateModule } from './exchange-rate/module/wallet.module';
import { WalletModule } from './wallet/module/wallet.module';


@Module({
  imports: [WalletModule, RateModule]
})
export class ApiModule {}