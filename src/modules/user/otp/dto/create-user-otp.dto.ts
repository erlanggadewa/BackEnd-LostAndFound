import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateUserOtpDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
