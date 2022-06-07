import { IsNotEmpty, IsUUID } from 'class-validator';

export class RejectAnswerPostDto {
  @IsUUID()
  @IsNotEmpty()
  answerId: string;
}
