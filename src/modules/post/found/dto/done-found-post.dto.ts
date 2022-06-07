import { IsNotEmpty, IsUUID } from 'class-validator';

export class DoneFoundPostDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsUUID()
  @IsNotEmpty()
  answerId: string;
}
