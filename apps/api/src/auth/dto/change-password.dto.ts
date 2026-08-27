import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Current password is required',
  })
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'New password is required',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    {
      message:
        'Must be at least 8 characters, one uppercase, one symbol and one number',
    },
  )
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Confirm password is required',
  })
  confirmPassword: string;
}
