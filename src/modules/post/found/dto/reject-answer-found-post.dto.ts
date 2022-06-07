import { IsNotEmpty, IsUUID } from 'class-validator';

export class RejectAnswerFoundPostDto {
  @IsUUID()
  @IsNotEmpty()
  answerId: string;
}
