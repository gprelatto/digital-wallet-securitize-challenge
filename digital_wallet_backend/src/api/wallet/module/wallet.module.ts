import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/db/entities/wallet.entity';
import { WalletController } from '../controller/wallet.controller';
import { WalletService } from '../service/wallet.service';
import { WalletRepository } from '../repository/wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [WalletService,WalletRepository],
  exports:[WalletService]
})
export class WalletModule {}