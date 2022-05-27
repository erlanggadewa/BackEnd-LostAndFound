import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { SetDonePostDto } from './dto/set-done-post.dto';
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
    });
  }

  async findAllFollowingPost(userId: string) {
    // * Query posts that are not posted by users and posts containing questions or answers that belong to the user's own ID
    const lostPosts = await this.prisma.post.findMany({
      where: {
        userId: { not: userId },
        typePost: 'Lost',
        activeStatus: true,
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
      },
    });

    const foundPosts = await this.prisma.post.findMany({
      where: {
        userId: { not: userId },
        typePost: 'Found',
        activeStatus: true,
        deleteStatus: false,
        Questions: { some: { Answers: { some: { userId } } } },
      },
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
      },
    });

    return lostPosts.concat(foundPosts);
  }

  async findMyFoundPost(postId: string, userId: string) {
    return await this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
        typePost: 'Found',
        activeStatus: true,
        deleteStatus: false,
      },
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
              include: { User: true },
            },
          },
        },
      },
    });
  }

  async findMyLostPost(postId: string, userId: string) {
    return await this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
        typePost: 'Lost',
        activeStatus: true,
        deleteStatus: false,
      },
      include: {
        Questions: {
          where: {
            userId: { not: userId },
            typeQuestion: 'UserQuestion',
            statusQuestion: 'Waiting',
          },
        },
      },
    });
  }

  async setLostPostToFinish(setDonePostDto: SetDonePostDto) {
    const { postId, questionId, answerId } = setDonePostDto;

    try {
      const post = await this.prisma.post.update({
        where: { id: postId },
        data: { activeStatus: false },
      });
      const question = await this.prisma.question.update({
        where: { id: questionId },
        data: { statusQuestion: 'Finished' },
      });
      const answer = await this.prisma.answer.update({
        where: { id: answerId },
        data: { statusAnswer: 'Finished' },
      });
      return {
        Post: { ...post },
        Question: { ...question },
        Answer: { ...answer },
      };
    } catch (error) {
      throw error;
    }
  }
}
