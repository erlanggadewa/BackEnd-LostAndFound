import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
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

  async findOne(postId: string, userId: string) {
    const data = await this.prisma.post.findUnique({ where: { id: postId } });
    if (userId == data.userId) {
      return await this.prisma.post.findUnique({
        where: { id: postId },
        include: { Questions: { include: { Answers: true } } },
      });
    }
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
  async findAllUserFoundPost(userId: string) {
    return await this.prisma.post.findMany({
      where: { userId, typePost: 'Found' },
    });
  }

  async findAllFollowingFoundPost(userId: string, filter: FilterPostDto) {
    return await this.prisma.post.findMany({
      where: {
        typePost: 'Found',
        activeStatus: true,
        Questions: {
          some: {
            typeQuestion: 'PostQuestion',
            Answers: { some: { userId, statusAnswer: filter.statusAnswer } },
          },
        },
      },
    });
  }

  async findSocialMediaByPostId(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, socialMedia: true, socialMediaType: true },
    });
    const postOwner = await this.prisma.user.findUnique({
      where: { id: post.userId },
    });

    return { name: postOwner.name, imgUrl: postOwner.imgUrl, ...post };
  }
  async findQuestionByFoundPostId(postId: string) {
    return await this.prisma.post.findUnique({
      where: { id: postId },
      select: { Questions: { where: { typeQuestion: 'PostQuestion' } } },
    });
  }
}
