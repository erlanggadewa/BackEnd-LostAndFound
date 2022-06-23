import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetUserPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
