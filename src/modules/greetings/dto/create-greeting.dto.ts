import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGreetingDto {
  @IsNotEmpty()
  @IsString()
  value: string;
}
