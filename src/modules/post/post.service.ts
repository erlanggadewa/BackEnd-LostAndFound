import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { RejectAnswerPostDto } from './dto/reject-answer-post.dto';
import { FilterSearchPostDto } from './dto/search-post.dto';
import { SetAcceptPostDto } from './dto/set-accept-post.dto';
import { SetDonePostDto } from './dto/set-done-post.dto';
import { SetRejectPostDto } from './dto/set-reject-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto) {
    try {
      const data: Prisma.PostCreateInput = createPostDto;
      return await this.prisma.post.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.post.findMany();
  }

  async findOne(postId: string) {
    const data = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { Questions: { include: { Answers: true } } },
    });

    return data;
  }

  async update(postId: string, updatePostDto: UpdatePostDto) {
    try {
      const data: Prisma.PostUpdateInput = updatePostDto;
      return await this.prisma.post.update({ where: { id: postId }, data });
    } catch (error) {
      throw error;
    }
  }

  async remove(postId: string) {
    try {
      return await this.prisma.post.delete({ where: { id: postId } });
    } catch (error) {
      throw error;
    }
  }

  async findAllUserPosts(userId: string) {
    return await this.prisma.post.findMany({
      where: { userId, activeStatus: true, deleteStatus: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findAllFollowingPost(userId: string) {
    // * Query posts that are not posted by users and posts containing questions or answers that belong to the user's own ID

    const lostPosts = await this.prisma.post.findMany({
      where: {
        userId: { not: userId },
        typePost: 'Lost',
        deleteStatus: false,
        Questions: {
          some: {
            userId,
            Answers: {
              every: {
                statusAnswer: { notIn: ['Finished', 'Rejected'] },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        Questions: {
          where: {
            userId,
            typeQuestion: 'UserQuestion',
            statusQuestion: { notIn: ['Finished', 'Rejected'] },
          },
          include: {
            Answers: {
              where: {
                userId: { not: userId },
              },
            },
          },
        },
        User: { select: { email: true, name: true, imgUrl: true } },
      },
    });

    const foundPosts = await this.prisma.post.findMany({
      where: {
        userId: { not: userId },
        typePost: 'Found',
        deleteStatus: false,
        Questions: { some: { Answers: { some: { userId } } } },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        Questions: {
          where: {
            userId: { not: userId },
            typeQuestion: 'PostQuestion',
            statusQuestion: { notIn: ['Finished', 'Rejected'] },
          },
          include: {
            Answers: {
              where: { userId },
            },
          },
        },
        User: { select: { email: true, name: true, imgUrl: true } },
      },
    });

    return lostPosts.concat(foundPosts);
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

  async setLostPostToFinish(setDonePostDto: SetDonePostDto) {
    const { postId, questionId, answerId } = setDonePostDto;

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
        where: { id: { not: answerId } },
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
  async setLostPostToReject(setRejectPostDto: SetRejectPostDto) {
    try {
      const { answerId, questionId } = setRejectPostDto;

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
  async setFoundPostToAccept(setDonePostDto: SetDonePostDto) {
    try {
      const { postId, questionId, answerId } = setDonePostDto;

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

  async setFoundPostToFinish(setAcceptPostDto: SetAcceptPostDto) {
    try {
      const { postId, questionId } = setAcceptPostDto;

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

  async getNewsFoundPosts() {
    return await this.prisma.post.findMany({
      where: { typePost: 'Found', activeStatus: true, deleteStatus: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getNewsLostPosts() {
    return await this.prisma.post.findMany({
      where: { typePost: 'Lost', activeStatus: true, deleteStatus: false },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async searchLostPost(filterSearchPostDto: FilterSearchPostDto) {
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
    });
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

  async setFoundPostToReject(rejectAnswerPostDto: RejectAnswerPostDto) {
    try {
      const { answerId } = rejectAnswerPostDto;
      return await this.prisma.answer.update({
        where: { id: answerId },
        data: { statusAnswer: 'Rejected' },
      });
    } catch (error) {
      throw error;
    }
  }
}
