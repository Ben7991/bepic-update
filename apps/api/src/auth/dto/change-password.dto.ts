import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
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
      message: 'New password is required',
    },
  )
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Confirm password is required',
  })
  confirmPassword: string;
}
