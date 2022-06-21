import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class ResendUserOtpDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
