import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterSearchPostDto } from '../dto/search-post.dto';
import { AcceptFoundPostDto } from './dto/accept-found-post.dto';
import { DoneFoundPostDto } from './dto/done-found-post.dto';
import { RejectAnswerFoundPostDto } from './dto/reject-answer-found-post.dto';

@Injectable()
export class PostFoundService {
  constructor(private readonly prisma: PrismaService) {}

  async setFoundPostToAccept(DonePostDto: DoneFoundPostDto) {
    try {
      const { postId, questionId, answerId } = DonePostDto;

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

  async setFoundPostToFinish(acceptPostDto: AcceptFoundPostDto) {
    try {
      const { postId, questionId } = acceptPostDto;

      const finishedPost = await this.prisma.post.update({
        where: { id: postId },
        data: { activeStatus: false },
      });

      const finishedQuestion = await this.prisma.question.update({
        where: { id: questionId },
        data: { statusQuestion: 'Finished' },
      });
      return {
        FinishedPost: { ...finishedPost },
        FinishedQuestion: { ...finishedQuestion },
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
}
