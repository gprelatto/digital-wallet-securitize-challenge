import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ExchangeRateRepository } from '../repository/rate.repository';
import { Wallet } from 'src/db/entities/wallet.entity';
import { AddRateDTO, EditRateDTO } from '../dto/rate.dto';
import * as dotenv from 'dotenv';
import { getEnvPath } from '@/common/helper/env.helper';
import axios from 'axios';
import { ExchangeRate } from '@/db/entities/exchange-rate';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
dotenv.config({path: envFilePath});

@Injectable()
export class ExchangeRateService {

  @Inject(ExchangeRateRepository)
  private readonly rateRepo: ExchangeRateRepository;


  private async getConvertionRates() : Promise<any> {
    const cryptoCompareEndpoint = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR`
    try {
      const response = await axios.get(cryptoCompareEndpoint);
      if(response.data){
        const rates = response.data;
        return rates
      } else {
        return 0;
      }
    }
    catch (error) {
      console.log(error);
      return 0;
    }
  }

  public async addRate(body: AddRateDTO): Promise<ExchangeRate> {
    try {
      const currency = await this.rateRepo.findCurrencyByID(body.currency_id);
      if(!currency){
        throw new HttpException('Non existent Currency.', HttpStatus.BAD_REQUEST);
      }          
      
      let rateToAdd : ExchangeRate = new ExchangeRate();
      rateToAdd.createdAt = new Date();
      rateToAdd.rate = body.rate;
      rateToAdd.currency = currency;

      const result = await this.rateRepo.saveRate(rateToAdd);
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }
 
  public async updateRate(body: EditRateDTO): Promise<ExchangeRate> {
    try {
      let rate = await this.rateRepo.findByID(body.rate_id);
      if(!rate){
        throw new HttpException('Non existent Rate.', HttpStatus.BAD_REQUEST);
      }          
      
      rate.rate = body.rate;

      const result = await this.rateRepo.saveRate(rate);
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async getRates(): Promise<ExchangeRate[]> {
    try {
      const result = await this.rateRepo.findAll();
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async getRateByCurrency(_id:number): Promise<ExchangeRate> {
    try {
      const result = await this.rateRepo.findByCurrency(_id)
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }


  public async updateConversionRates(): Promise<boolean> {
    try {
      const ratesObtained = await this.getConvertionRates()

      const currencyUSD = await this.rateRepo.findCurrencyByID(1);
      const currencyEURO = await this.rateRepo.findCurrencyByID(2);
      
      let usdRate : ExchangeRate = new ExchangeRate();
      let eurRate : ExchangeRate = new ExchangeRate();

      let eUsdRate =  await this.rateRepo.findByCurrency(1)
      let eEurRate =  await this.rateRepo.findByCurrency(2)

      if(eUsdRate){
        usdRate = eUsdRate
      } else {
        
        usdRate.currency = currencyUSD;
      }
      if(eEurRate){
        eurRate = eEurRate
      } else {
        eurRate.currency = currencyEURO;
      }
      
      usdRate.createdAt = new Date();
      eurRate.createdAt = new Date();
      eurRate.rate = ratesObtained['EUR'];
      usdRate.rate = ratesObtained['USD'];

      const resultUSD = await this.rateRepo.saveRate(usdRate);
      const resultEUR = await this.rateRepo.saveRate(eurRate);

      if(resultUSD && resultEUR){
        return true;
      } else {
        return false;
      }
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }



}