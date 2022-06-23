import { IsNotEmpty, IsString } from 'class-validator';

export default class VerifyUserOtpDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
