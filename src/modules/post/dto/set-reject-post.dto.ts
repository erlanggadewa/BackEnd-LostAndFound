import { IsNotEmpty, IsUUID } from 'class-validator';

export class SetRejectPostDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsUUID()
  @IsNotEmpty()
  answerId: string;
}
