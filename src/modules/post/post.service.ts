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

  async findOne(id: string) {
    return await this.prisma.post.findUnique({ where: { id } });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const data: Prisma.PostUpdateInput = updatePostDto;
      return await this.prisma.post.update({ where: { id }, data });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.post.delete({ where: { id } });
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
    console.log(
      '🚀 ~ file: post.service.ts ~ line 66 ~ PostService ~ findSocialMediaByPostId ~ postId',
      postId,
    );
    return await this.prisma.post.findUnique({
      where: { id: postId },
      select: { socialMedia: true, socialMediaType: true },
    });
  }
}
