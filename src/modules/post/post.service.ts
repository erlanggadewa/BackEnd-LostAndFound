import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
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
              where: { userId: { not: userId } },
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
            statusQuestion: 'Waiting',
          },
          include: { Answers: true },
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
}
