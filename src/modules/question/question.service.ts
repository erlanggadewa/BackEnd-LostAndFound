import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createQuestionDto: CreateQuestionDto) {
    try {
      const data: Prisma.QuestionCreateInput = createQuestionDto;
      return await this.prisma.question.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.question.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.question.findUnique({ where: { id } });
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    try {
      const data: Prisma.QuestionUpdateInput = updateQuestionDto;
      return await this.prisma.question.update({ where: { id }, data });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.question.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async getQuestionForValidation(answerId: string) {
    return await this.prisma.answer.findFirst({
      where: {
        id: answerId,
      },
      include: { Question: true },
    });
  }
}
