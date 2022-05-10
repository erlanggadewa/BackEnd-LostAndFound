import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

enum TypeQuestion {
  PostQuestion = 'PostQuestion',
  UserQuestion = 'UserQuestion',
}

enum StatusConfirmation {
  Approved = 'Approved',
  Waiting = 'Waiting',
  Rejected = 'Rejected',
  Answered = 'Answered',
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

  @IsEnum(StatusConfirmation)
  @IsNotEmpty()
  statusQuestion: StatusConfirmation;
}
