import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @Matches(/^[0-9]+(\.[0-9]{2})?$/, {
    message: 'Invalid price',
  })
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @Matches(/^[0-9]+$/, { message: 'Only numbers are allowed' })
  @ApiProperty()
  point: number;
}
