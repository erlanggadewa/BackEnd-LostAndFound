import { IsNotEmpty, IsString } from 'class-validator';

export default class VerificationEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
