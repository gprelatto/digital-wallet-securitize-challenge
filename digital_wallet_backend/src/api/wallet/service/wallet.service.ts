import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WalletRepository } from '../repository/wallet.repository';
import { Wallet } from 'src/db/entities/wallet.entity';
import { AddWalletDTO } from '../dto/wallet.dto';
import * as dotenv from 'dotenv';
import { getEnvPath } from '@/common/helper/env.helper';
import axios from 'axios';
var Web3 = require('web3');

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
dotenv.config({path: envFilePath});

@Injectable()
export class WalletService {

  @Inject(WalletRepository)
  private readonly walletRepo: WalletRepository;

  private async checkIfOld(_address: string) : Promise<boolean> {
    const etherscanEndpoint = `https://api.etherscan.io/api?module=account&action=txlist&address=${_address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
    try {
      const response = await axios.get(etherscanEndpoint);
      if(response.data.result.length > 0){
        const responseData = response.data.result[0];
        const currentTimestamp = new Date().getTime();
        const firstTxTimestamp = new Date(Number(responseData.timeStamp)* 1000).getTime();
        const diffTimestamp = currentTimestamp - firstTxTimestamp;
        const diffInDays = Math.ceil(diffTimestamp / (1000 * 3600 * 24))
        if(diffInDays >= 365){
          return true
        } else {
          return false
        }
      } else {
        return false;
      }
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  private async getBalance(_address: string) : Promise<number> {
    const etherscanEndpoint = `https://api.etherscan.io/api?module=account&action=balance&address=${_address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`
    try {
      const response = await axios.get(etherscanEndpoint);
      if(response.data.result.length > 0){
        const balanceWei = response.data.result;
        const balance = Web3.utils.fromWei(balanceWei, 'ether');
        return balance
      } else {
        return 0;
      }
    }
    catch (error) {
      console.log(error);
      return 0;
    }
  }

  public async addWallet(body: AddWalletDTO): Promise<Wallet> {
    try {
      const wallet = await this.walletRepo.findByAddress(body.address);
      if(wallet){
        throw new HttpException('Existent Wallet.', HttpStatus.BAD_REQUEST);
      }          
      let walletToAdd : Wallet = new Wallet();
      walletToAdd.createdAt = new Date();
      walletToAdd.address = body.address;
      walletToAdd.isFavorite = false;
      walletToAdd.isOld = await this.checkIfOld(body.address);
      const result = await this.walletRepo.saveWallet(walletToAdd);
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }



  public async favWallet(body: AddWalletDTO): Promise<Wallet> {
    try {
      let wallet = await this.walletRepo.findByAddress(body.address);
      if(!wallet){
        throw new HttpException('Non Existent Wallet.', HttpStatus.BAD_REQUEST);
      }
      if(wallet.isFavorite){
        wallet.isFavorite = false;
      }
      else {
        wallet.isFavorite = true;
      }
      const result = await this.walletRepo.saveWallet(wallet);
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }


  public async removeWallet(_address: string): Promise<Wallet> {
    try {
      let wallet = await this.walletRepo.findByAddress(_address);
      if(!wallet){
        throw new HttpException('Non existent Wallet.', HttpStatus.BAD_REQUEST);
      }     
      const result = await this.walletRepo.removeWallet(wallet.id);
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }  
 
  public async getWallets(): Promise<Wallet[]> {
    try {
      const result = await this.walletRepo.findAll();
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async getWalletByID(_id:number): Promise<Wallet> {
    try {
      const result = await this.walletRepo.findById(_id)
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async getWalletByAddress(_address:string): Promise<Wallet> {
    try {
      const result = await this.walletRepo.findByAddress(_address)
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

  public async getWalletBalance(_address:string): Promise<number> {
    try {
      const result = await this.getBalance(_address)
      return result;
    } 
    catch (error) {
      throw new HttpException(error.detail, HttpStatus.CONFLICT)
    }
  }

}