import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class AddRateDTO {
  @IsNumber()
  @ApiProperty()
  public currency_id:number;

  @IsNumber()
  @ApiProperty()
  public rate:number;
}


export class EditRateDTO {
  @IsNumber()
  @ApiProperty()
  public rate_id:number;

  @IsNumber()
  @ApiProperty()
  public rate:number;
}
