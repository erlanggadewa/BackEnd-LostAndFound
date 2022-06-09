import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DonePostDto } from '../dto/done-post.dto';
import { FilterSearchPostDto } from '../dto/search-post.dto';
import { RejectAnswerFoundPostDto } from './dto/reject-answer-found-post.dto';

@Injectable()
export class PostFoundService {
  constructor(private readonly prisma: PrismaService) {}

  async setFoundPostToAccept(donePostDto: DonePostDto) {
    try {
      const { postId, questionId, answerId } = donePostDto;

      const finishedPost = await this.prisma.post.update({
        where: { id: postId },
        data: { activeStatus: false },
      });

      const finishedQuestions = await this.prisma.question.update({
        where: { id: questionId },
        data: { statusQuestion: 'Answered' },
      });

      const acceptedAnswer = await this.prisma.answer.update({
        where: { id: answerId },
        data: { statusAnswer: 'Accepted' },
      });

      const rejectedAnswers = await this.prisma.answer.updateMany({
        where: { id: { not: answerId }, questionId },
        data: { statusAnswer: 'Rejected' },
      });
      return {
        FinishedPost: { ...finishedPost },
        FinishedQuestions: { ...finishedQuestions },
        AcceptedAnswer: { ...acceptedAnswer },
        RejectedAnswers: { ...rejectedAnswers },
      };
    } catch (error) {
      throw error;
    }
  }

  async setFoundPostToFinish(donePostDto: DonePostDto) {
    try {
      const { postId, questionId, answerId } = donePostDto;

      const finishedPost = await this.prisma.post.update({
        where: { id: postId },
        data: { activeStatus: false },
      });

      const finishedQuestion = await this.prisma.question.update({
        where: { id: questionId },
        data: { statusQuestion: 'Finished' },
      });

      const acceptedAnswer = await this.prisma.answer.update({
        where: { id: answerId },
        data: { statusAnswer: 'Finished' },
      });

      const rejectedAnswers = await this.prisma.answer.updateMany({
        where: { id: { not: answerId } },
        data: { statusAnswer: 'Rejected' },
      });

      return {
        FinishedPost: { ...finishedPost },
        FinishedQuestion: { ...finishedQuestion },
        AcceptedAnswer: { ...acceptedAnswer },
        RejectedAnswers: { ...rejectedAnswers },
      };
    } catch (error) {
      throw error;
    }
  }

  async searchFoundPost(filterSearchPostDto: FilterSearchPostDto) {
    return await this.prisma.post.findMany({
      where: {
        typePost: 'Found',
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
    });
  }

  async setFoundPostToReject(
    rejectAnswerFoundPostDto: RejectAnswerFoundPostDto,
  ) {
    try {
      const { answerId } = rejectAnswerFoundPostDto;
      return await this.prisma.answer.update({
        where: { id: answerId },
        data: { statusAnswer: 'Rejected' },
      });
    } catch (error) {
      throw error;
    }
  }

  async getNewsFoundPosts(paginationDto: PaginationDto) {
    return await this.prisma.post.findMany({
      skip: paginationDto.offset,
      take: paginationDto.limit,
      where: { typePost: 'Found', activeStatus: true, deleteStatus: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findMyFoundPost(postId: string, userId: string) {
    const foundPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
        typePost: 'Found',
        activeStatus: true,
        deleteStatus: false,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        Questions: {
          where: {
            userId,
            typeQuestion: 'PostQuestion',
          },
          include: {
            Answers: {
              where: {
                userId: { not: userId },
                statusAnswer: { in: ['Waiting', 'Accepted'] },
              },
              include: {
                User: { select: { email: true, name: true, imgUrl: true } },
              },
            },
          },
        },
      },
    });

    return foundPost;
  }
}
