import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class InsertAnswerLostPostDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
