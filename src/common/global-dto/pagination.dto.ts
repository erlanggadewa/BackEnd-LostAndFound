import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Skip that many rows before beginning to return rows',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;

  @ApiProperty({ description: 'How many data should be returned' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
