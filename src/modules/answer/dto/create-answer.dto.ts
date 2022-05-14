import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

enum StatusAnswer {
  Finished = 'Finished',
  Waiting = 'Waiting',
  Rejected = 'Rejected',
  Accepted = 'Accepted',
}

export class CreateAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsEnum(StatusAnswer)
  @IsNotEmpty()
  statusAnswer: StatusAnswer;
}
