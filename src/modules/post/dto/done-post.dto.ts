import { IsNotEmpty, IsUUID } from 'class-validator';

export class DonePostDto {
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
