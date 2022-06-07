import { IsNotEmpty, IsUUID } from 'class-validator';

export class RejectAnswerLostPostDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsUUID()
  @IsNotEmpty()
  answerId: string;
}
