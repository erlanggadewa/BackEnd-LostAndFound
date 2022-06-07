import { IsNotEmpty, IsUUID } from 'class-validator';

export class AcceptFoundPostDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;
}
