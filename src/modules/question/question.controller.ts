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
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionService } from './question.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@ApiTags('Question')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    const data = await this.questionService.create(createQuestionDto);
    return { data, message: 'Question created successfully' };
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':questionId')
  findOne(@Param('questionId', ParseUUIDPipe) questionId: string) {
    return this.questionService.findOne(questionId);
  }

  @Patch(':questionId')
  async update(
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const data = await this.questionService.update(
      questionId,
      updateQuestionDto,
    );
    return { data, message: 'Question updated successfully' };
  }

  @Delete(':questionId')
  async remove(@Param('questionId', ParseUUIDPipe) questionId: string) {
    const data = await this.questionService.remove(questionId);
    return { data, message: 'Question deleted successfully' };
  }
}
