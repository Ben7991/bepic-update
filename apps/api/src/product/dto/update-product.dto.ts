import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    { message: 'Invalid price' },
  )
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  point: number;
}
