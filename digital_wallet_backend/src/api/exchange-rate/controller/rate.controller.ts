import { ExchangeRate } from '@/db/entities/exchange-rate';
import { Body, Controller, Inject, Post, Get,  Req, Res, HttpStatus , Param, Put } from '@nestjs/common';
import {  ApiCreatedResponse,  ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Wallet } from 'src/db/entities/wallet.entity';
import { AddRateDTO, EditRateDTO } from '../dto/rate.dto';
import { ExchangeRateService } from '../service/rate.service';

@ApiTags('Rate')
@Controller('walletAPI/rate-controller')

export class RateController {
  @Inject(ExchangeRateService)
  private readonly rateService: ExchangeRateService;


  @Post('save-rate')
  @ApiCreatedResponse({
    description: 'Save a Rate into database.',
    type: ExchangeRate,
  })
  private async save(@Req() req: Request, @Res() res, @Body() body: AddRateDTO): Promise<ExchangeRate> {
    const result = await this.rateService.addRate(body)
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Put('update-rate')
  @ApiCreatedResponse({
    description: 'Update a stored rate.',
    type: ExchangeRate,
  })
  private async update(@Req() req: Request, @Res() res, @Body() body: EditRateDTO): Promise<ExchangeRate> {
    const result = await this.rateService.updateRate(body)
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Put('update-rate-external')
  @ApiCreatedResponse({
    description: 'Update rates using external API.',
    type: ExchangeRate,
  })
  private async updateExternal(@Req() req: Request, @Res() res): Promise<boolean> {
    const result = await this.rateService.updateConversionRates()
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Get('get-rates')
  private async get(@Req() req: Request, @Res() res): Promise<ExchangeRate[]> {
    const result = await this.rateService.getRates();
    if (result.length > 0) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    }
    else {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
  }

  @Get('get-rate-by-currency/:currencyId')
  private async getWalletId(@Res() res, @Param('currencyId') _currency: number): Promise<Wallet> {
    const result = await this.rateService.getRateByCurrency(_currency);
    if (result) {
      return res.status(HttpStatus.ACCEPTED).send(result);
    }
    else {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
  }
}