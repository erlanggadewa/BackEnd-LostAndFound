import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAnswerDto: CreateAnswerDto) {
    try {
      const data: Prisma.AnswerCreateInput = createAnswerDto;
      return await this.prisma.answer.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.answer.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.answer.findUnique({ where: { id } });
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto) {
    try {
      const data: Prisma.AnswerUpdateInput = updateAnswerDto;
      return await this.prisma.answer.update({ where: { id }, data });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.answer.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async rejectAnswerInFinishedPost(answerId: string, questionId: string) {
    try {
      await this.prisma.question.update({
        where: { id: questionId },
        data: { statusQuestion: 'Finished' },
      });

      await this.prisma.answer.updateMany({
        where: { id: { not: answerId }, questionId },
        data: { statusAnswer: 'Rejected' },
      });

      return await this.prisma.answer.update({
        where: { id: answerId },
        data: { statusAnswer: 'Accepted' },
      });
    } catch (error) {
      throw error;
    }
  }
}
