import { Currency } from '@/db/entities/currency.entity';
import { ExchangeRate } from '@/db/entities/exchange-rate';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/db/entities/wallet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExchangeRateRepository {

  @InjectRepository(ExchangeRate)
  private readonly exchangeRepo: Repository<ExchangeRate>;
  @InjectRepository(Currency)
  private readonly currencyRepo: Repository<Currency>;


  public async findCurrencyByID(_currencyId: number): Promise<Currency> {
    try {
      const result = await this.currencyRepo.findOne({
        where: {
          id: _currencyId
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async findByID(_id: number): Promise<ExchangeRate> {
    try {
      const result = await this.exchangeRepo.findOne({
        where: {
          id: _id
        },
        relations: {
          currency:true
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }



  public async findByCurrency(_currencyId: number): Promise<ExchangeRate> {
    try {
      const result = await this.exchangeRepo.findOne({
        where: {
          currency: {id: _currencyId}
        },
        relations: {
          currency:true
        },
        order: {
          createdAt: "DESC"
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async findAll(): Promise<ExchangeRate[]> {
    try {
      const result = await this.exchangeRepo.find({ relations: {currency:true}});
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async saveRate(_exchangeRate: ExchangeRate): Promise<ExchangeRate> {
    try {
      const result = await this.exchangeRepo.save(_exchangeRate);
      return result;
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async removeRate(_id: number): Promise<ExchangeRate> {
    try {
      let exchangeRate = await this.exchangeRepo.findOne({
        where: {
          id: _id
        }
      });

      if (exchangeRate) {
        exchangeRate.deletedAt = new Date()
        const result = await this.exchangeRepo.save(exchangeRate);
        return result;
      } else {
        throw new HttpException('Non existent wallet', HttpStatus.CONFLICT)
      }
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

}