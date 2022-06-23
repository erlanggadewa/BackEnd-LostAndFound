import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RecreatePasswordUserDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
