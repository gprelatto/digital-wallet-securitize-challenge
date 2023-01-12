import { Body, Controller, Inject, Post, Get,  Req, Res, HttpStatus , Param, Put } from '@nestjs/common';
import {  ApiCreatedResponse,  ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { WalletService } from '../service/wallet.service';
import { Wallet } from 'src/db/entities/wallet.entity';
import { AddWalletDTO } from '../dto/wallet.dto';

@ApiTags('Wallet')
@Controller('walletAPI/wallet-controller')

export class WalletController {
  @Inject(WalletService)
  private readonly walletService: WalletService;


  @Post('save-wallet')
  @ApiCreatedResponse({
    description: 'Save a wallet address into database.',
    type: Wallet,
  })
  private async saveWallet(@Req() req: Request, @Res() res, @Body() body: AddWalletDTO): Promise<Wallet> {
    const result = await this.walletService.addWallet(body)
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Put('fav-wallet')
  @ApiCreatedResponse({
    description: 'Fav or Unfav a wallet address.',
    type: Wallet,
  })
  private async favWallet(@Req() req: Request, @Res() res, @Body() body: AddWalletDTO): Promise<Wallet> {
    const result = await this.walletService.favWallet(body)
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Post('remove-wallet/:address')
  @ApiCreatedResponse({
    description: 'Removes a stored wallet.',
    type: Wallet,
  })
  private async removeWallet(@Req() req: Request, @Res() res, @Param('address') _address: string): Promise<Wallet> {
    const result = await this.walletService.removeWallet(_address)
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Get('get-wallets')
  private async getWallets(@Req() req: Request, @Res() res): Promise<Wallet[]> {
    const result = await this.walletService.getWallets();
    if (result.length > 0) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    }
    else {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
  }

  @Get('get-wallet-by-id/:id')
  private async getWalletId(@Res() res, @Param('id') _id: number): Promise<Wallet> {
    const result = await this.walletService.getWalletByID(_id);
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    }
    else {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
  }

  @Get('get-wallet-by-address/:address')
  private async getWalletAddress(@Res() res, @Param('address') _address: string): Promise<Wallet> {
    const result = await this.walletService.getWalletByAddress(_address);
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    }
    else {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
  }

  @Get('get-wallet-balance/:address')
  private async getWalletBalance(@Res() res, @Param('address') _address: string): Promise<number> {
    const result = await this.walletService.getWalletBalance(_address);
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    }
    else {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
  }

}