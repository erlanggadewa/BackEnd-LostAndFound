import { IsEnum, IsOptional, IsUUID } from 'class-validator';

enum StatusConfirmation {
  Approved = 'Approved',
  Waiting = 'Waiting',
  Rejected = 'Rejected',
  Answered = 'Answered',
}

enum TypePost {
  Lost = 'Lost',
  Found = 'Found',
}

export class FilterPostDto {
  @IsEnum(StatusConfirmation)
  @IsOptional()
  statusAnswer?: StatusConfirmation;

  @IsEnum(StatusConfirmation)
  @IsOptional()
  statusQuestion?: StatusConfirmation;

  @IsEnum(TypePost)
  @IsOptional()
  typePost?: TypePost;

  @IsUUID()
  @IsOptional()
  userId?: string;
}
