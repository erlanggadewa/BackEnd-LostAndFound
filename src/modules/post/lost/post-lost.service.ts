import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/global-dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DonePostDto } from '../dto/done-post.dto';
import { FilterSearchPostDto } from '../dto/search-post.dto';
import { InsertAnswerLostPostDto } from './dto/insert-answer-lost-post.dto';
import { RejectAnswerLostPostDto } from './dto/reject-answer-found-post.dto';

@Injectable()
export class PostLostService {
  constructor(private readonly prisma: PrismaService) {}

  async searchLostPost(
    filterSearchPostDto: FilterSearchPostDto,
    userId: string,
  ) {
    return await this.prisma.post.findMany({
      where: {
        typePost: 'Lost',
        activeStatus: true,
        deleteStatus: false,
        OR: [
          {
            title: {
              contains: filterSearchPostDto.filter,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: filterSearchPostDto.filter,
              mode: 'insensitive',
            },
          },
          {
            chronology: {
              contains: filterSearchPostDto.filter,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        Questions: {
          where: { userId },
          include: { Answers: true },
        },
      },
    });
  }

  async getNewsLostPosts(paginationDto: PaginationDto, userId: string) {
    return await this.prisma.post.findMany({
      skip: paginationDto.offset,
      take: paginationDto.limit,
      where: { typePost: 'Lost', activeStatus: true, deleteStatus: false },
      orderBy: { updatedAt: 'desc' },
      include: {
        Questions: {
          where: { userId },
          include: { Answers: true },
        },
      },
    });
  }

  async setLostPostToFinish(donePostDto: DonePostDto) {
    const { postId, questionId, answerId } = donePostDto;

    try {
      const finishedPost = await this.prisma.post.update({
        where: { id: postId },
        data: { activeStatus: false },
      });

      const rejectedQuestions = await this.prisma.question.updateMany({
        where: { id: { not: questionId }, postId },
        data: { statusQuestion: 'Rejected' },
      });

      const finishedQuestions = await this.prisma.question.update({
        where: { id: questionId },
        data: { statusQuestion: 'Finished' },
      });

      const finishedAnswer = await this.prisma.answer.update({
        where: { id: answerId },
        data: { statusAnswer: 'Finished' },
      });

      const rejectedAnswer = await this.prisma.answer.updateMany({
        where: { id: { not: answerId }, questionId },
        data: { statusAnswer: 'Rejected' },
      });

      return {
        FinishedPost: { ...finishedPost },
        FinishedQuestions: { ...finishedQuestions },
        RejectedQuestions: { ...rejectedQuestions },
        FinishedAnswer: { ...finishedAnswer },
        RejectedAnswer: { ...rejectedAnswer },
      };
    } catch (error) {
      throw error;
    }
  }

  async setLostPostToReject(rejectAnswerLostPostDto: RejectAnswerLostPostDto) {
    try {
      const { answerId, questionId } = rejectAnswerLostPostDto;

      const rejectedAnswer = await this.prisma.answer.update({
        where: { id: answerId },
        data: { statusAnswer: 'Rejected' },
      });

      const rejectedQuestion = await this.prisma.question.update({
        where: { id: questionId },
        data: { statusQuestion: 'Rejected' },
      });

      return {
        RejectedAnswer: { ...rejectedAnswer },
        RejectedQuestion: { ...rejectedQuestion },
      };
    } catch (error) {
      throw error;
    }
  }

  async findMyLostPost(postId: string, userId: string) {
    const lostPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
        typePost: 'Lost',
        activeStatus: true,
        deleteStatus: false,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        Questions: {
          where: {
            userId: { not: userId },
            typeQuestion: 'UserQuestion',
            statusQuestion: 'Waiting',
          },
          include: {
            User: { select: { email: true, name: true, imgUrl: true } },
          },
        },
      },
    });

    return lostPost;
  }

  async answerLostPost(
    insertAnswerLostPostDto: InsertAnswerLostPostDto,
    userId: string,
  ) {
    try {
      const { questionId, answer } = insertAnswerLostPostDto;

      const insertedAnswer = await this.prisma.answer.create({
        data: { questionId, userId, answer, statusAnswer: 'Waiting' },
      });

      const updatedQuestion = await this.prisma.question.update({
        where: { id: questionId },
        data: { statusQuestion: 'Answered' },
      });

      return { insertedAnswer, updatedQuestion };
    } catch (error) {
      throw error;
    }
  }
}
