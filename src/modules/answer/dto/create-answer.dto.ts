import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

enum StatusConfirmation {
  Approved = 'Approved',
  Waiting = 'Waiting',
  Rejected = 'Rejected',
  Answered = 'Answered',
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
  Answer: string;

  @IsString()
  @IsNotEmpty()
  statusAnswer: StatusConfirmation;
}
