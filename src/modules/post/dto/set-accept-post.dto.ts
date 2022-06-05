import { IsNotEmpty, IsUUID } from 'class-validator';

export class SetAcceptPostDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;
}
