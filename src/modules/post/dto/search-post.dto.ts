import { IsOptional, IsString } from 'class-validator';

export class FilterSearchPostDto {
  @IsOptional()
  @IsString()
  filter?: string = '';
}
