import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/db/entities/wallet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletRepository {

  @InjectRepository(Wallet)
  private readonly walletRepo: Repository<Wallet>;

  public async findById(_id: number): Promise<Wallet> {
    try {
      const result = await this.walletRepo.findOne({
        where: {
          id: _id
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async findByAddress(_address: string): Promise<Wallet> {
    try {
      const result = await this.walletRepo.findOne({
        where: {
          address: _address
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async findAll(): Promise<Wallet[]> {
    try {
      const result = await this.walletRepo.find({order: {isFavorite:'DESC'}});
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async saveWallet(_wallet: Wallet): Promise<Wallet> {
    try {
      const result = await this.walletRepo.save(_wallet);
      return result;
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }
  
  public async removeWallet(_id: number): Promise<Wallet> {
    try {
      let repeated = await this.walletRepo.findOne({
        where: {
          id: _id
        }
      });

      if (repeated) {
        repeated.deletedAt = new Date()
        const result = await this.walletRepo.save(repeated);
        return result;
      } else {
        throw new HttpException('Non existent wallet', HttpStatus.CONFLICT)
      }
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

}