import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

enum TypeQuestion {
  PostQuestion = 'PostQuestion',
  UserQuestion = 'UserQuestion',
}

enum StatusQuestion {
  Answered = 'Answered',
  Waiting = 'Waiting',
  Rejected = 'Rejected',
  Finished = 'Finished',
}
export class CreateQuestionDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsEnum(TypeQuestion)
  @IsNotEmpty()
  typeQuestion: TypeQuestion;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsEnum(StatusQuestion)
  @IsNotEmpty()
  statusQuestion: StatusQuestion;
}
