import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class IncentiveDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  point: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  award: string;
}
