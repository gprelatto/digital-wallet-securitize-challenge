import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class AddWalletDTO {
  @IsString()
  @ApiProperty()
  public address:string;
}



