import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FollowingPosts } from './dto/following-post.dto';
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
    const posts = await this.prisma.post.findMany({
      where: { userId, activeStatus: true, deleteStatus: false },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { Questions: true },
        },
        Questions: { include: { _count: { select: { Answers: true } } } },
      },
    });

    const followingPosts: FollowingPosts[] =
      this.countTotalAnswerAndQuestion(posts);

    return followingPosts;
  }

  private countTotalAnswerAndQuestion(posts): FollowingPosts[] {
    return posts.map((post) => {
      let totalQuestion = 0;
      let totalAnswer = 0;

      totalQuestion += post._count.Questions;

      post.Questions.map((question) => {
        totalAnswer += question._count.Answers;
        return question;
      });
      delete post.Questions;
      delete post._count;

      return { ...post, totalQuestion, totalAnswer };
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
            typeQuestion: 'UserQuestion',
            statusQuestion: { notIn: ['Finished', 'Rejected'] },
            Answers: {
              every: {
                userId: { not: userId },
                statusAnswer: { notIn: ['Finished', 'Rejected'] },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        User: { select: { email: true, name: true, imgUrl: true } },
        Questions: {
          where: {
            userId,
            typeQuestion: 'UserQuestion',
            statusQuestion: { notIn: ['Finished', 'Rejected'] },
          },
          include: {
            Answers: true,
          },
        },
      },
    });

    const foundPosts = await this.prisma.post.findMany({
      where: {
        userId: { not: userId },
        typePost: 'Found',
        deleteStatus: false,
        Questions: {
          every: {
            userId: { not: userId },
            statusQuestion: { notIn: ['Finished', 'Rejected'] },
            Answers: {
              some: { userId },
              every: { statusAnswer: { not: 'Finished' } },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        User: { select: { email: true, name: true, imgUrl: true } },
        Questions: {
          where: {
            userId: { not: userId },
            typeQuestion: 'PostQuestion',
            statusQuestion: { notIn: ['Finished', 'Rejected'] },
          },
          include: {
            Answers: {
              where: {
                userId,
                statusAnswer: { notIn: ['Finished', 'Rejected'] },
              },
            },
          },
        },
      },
    });

    return lostPosts.concat(foundPosts);
  }

  async findAllHistoryPost(userId: string) {
    // * Query posts that are not posted by users and posts containing questions or answers that belong to the user's own ID and active status of post is false, means that post is done and case is closed

    const followingLostPosts = await this.prisma.post.findMany({
      where: {
        userId: { not: userId },
        typePost: 'Lost',
        activeStatus: false,
        deleteStatus: false,
        Questions: {
          some: {
            userId,
            typeQuestion: 'UserQuestion',
            statusQuestion: { in: ['Finished', 'Rejected'] },
            Answers: {
              some: {
                userId: { not: userId },
                statusAnswer: { in: ['Finished', 'Rejected'] },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const followingFoundPosts = await this.prisma.post.findMany({
      where: {
        typePost: 'Found',
        activeStatus: false,
        deleteStatus: false,
        Questions: {
          some: {
            statusQuestion: { in: ['Finished'] },
            typeQuestion: 'PostQuestion',
            Answers: {
              some: { userId, statusAnswer: { in: ['Finished', 'Rejected'] } },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        User: { select: { email: true, name: true, imgUrl: true } },
        Questions: {
          where: {
            typeQuestion: 'PostQuestion',
            statusQuestion: { in: ['Finished'] },
          },
          include: {
            Answers: {
              where: { userId, statusAnswer: { in: ['Finished', 'Rejected'] } },
            },
          },
        },
      },
    });

    const ownLostPosts = await this.prisma.post.findMany({
      where: {
        userId,
        typePost: 'Lost',
        activeStatus: false,
        deleteStatus: false,
        Questions: {
          some: {
            userId: { not: userId },
            typeQuestion: 'UserQuestion',
            statusQuestion: { in: ['Finished', 'Rejected'] },
            Answers: {
              some: {
                userId,
                statusAnswer: { in: ['Finished', 'Rejected'] },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        User: { select: { email: true, name: true, imgUrl: true } },
        Questions: {
          where: {
            userId: { not: userId },
            typeQuestion: 'UserQuestion',
            statusQuestion: { in: ['Finished', 'Rejected'] },
          },
          include: {
            Answers: {
              where: {
                userId,
                statusAnswer: { in: ['Finished', 'Rejected'] },
              },
            },
          },
        },
      },
    });

    const ownFoundPosts = await this.prisma.post.findMany({
      where: {
        userId,
        typePost: 'Found',
        activeStatus: false,
        deleteStatus: false,
        Questions: {
          every: {
            userId,
            statusQuestion: { in: ['Finished'] },
            typeQuestion: 'PostQuestion',
            Answers: {
              every: {
                userId: { not: userId },
                statusAnswer: { in: ['Finished', 'Rejected'] },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        User: { select: { email: true, name: true, imgUrl: true } },
        Questions: {
          where: {
            userId,
            typeQuestion: 'PostQuestion',
            statusQuestion: { in: ['Finished'] },
          },
          include: {
            Answers: {
              where: {
                userId: { not: userId },
                statusAnswer: { in: ['Finished', 'Rejected'] },
              },
            },
          },
        },
      },
    });

    // combine followingLostPosts, ownLostPosts, and foundPosts into a single JSON
    return {
      followingFoundPosts,
      followingLostPosts,
      ownLostPosts,
      ownFoundPosts,
    };
  }
}
