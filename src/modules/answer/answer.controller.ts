import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@ApiTags('Answer')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  async create(@Body() createAnswerDto: CreateAnswerDto) {
    const data = await this.answerService.create(createAnswerDto);
    return { data, message: 'Answer created successfully' };
  }

  @Get()
  findAll() {
    return this.answerService.findAll();
  }

  @Get(':answerId')
  findOne(@Param('answerId', ParseUUIDPipe) answerId: string) {
    return this.answerService.findOne(answerId);
  }

  @Patch(':answerId')
  async update(
    @Param('answerId', ParseUUIDPipe) answerId: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    const data = await this.answerService.update(answerId, updateAnswerDto);
    return { data, message: 'Answer updated successfully' };
  }

  @Delete(':answerId')
  async remove(@Param('answerId', ParseUUIDPipe) answerId: string) {
    const data = await this.answerService.remove(answerId);
    return { data, message: 'Answer removed successfully' };
  }
}
