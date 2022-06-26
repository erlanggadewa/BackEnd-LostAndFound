import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecreatePasswordUserDto } from '../auth/dto/recreate-password-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const data: Prisma.UserCreateInput = createUserDto;

      data.password = await this.hashingPassword(data.password);
      const userAccount = await this.prisma.user.create({ data });
      delete userAccount.password;
      return userAccount;
    } catch (error) {
      if (error.code === 'P2002') {
        error.message = 'Credential already exists';
      }
      throw error;
    }
  }

  async hashingPassword(password: string) {
    const saltOrRounds: string = await bcrypt.genSalt();
    return bcrypt.hash(password, saltOrRounds);
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.user.findUnique({ where: { id } });
      delete data.password;
      return data;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async getMyProfile(id: string) {
    const data = await this.prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { Posts: true } } },
    });

    const totalPost: number = data._count.Posts;
    delete data.password;
    delete data._count;
    const finalData: User & { totalPost: number } = { ...data, totalPost };

    return finalData;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const data: Prisma.UserUpdateInput = updateUserDto;
      const updatedUserAccount = await this.prisma.user.update({
        where: { id },
        data,
      });
      delete updatedUserAccount.password;
      return updatedUserAccount;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async recreatePassword(recreatePasswordUserDto: RecreatePasswordUserDto) {
    try {
      const { userId, password, confirmPassword } = recreatePasswordUserDto;

      if (password != confirmPassword) {
        throw new BadRequestException("Passwords doesn't not match");
      }

      const hashedPassword = await this.hashingPassword(password);

      const updatedData = await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      delete updatedData.password;
      return updatedData;
    } catch (error) {
      throw new InternalServerErrorException('Failed to recreate password');
    }
  }

  async upsert(createUserDto: CreateUserDto) {
    try {
      const data: Prisma.UserCreateInput = createUserDto;

      data.password = await this.hashingPassword(data.password);
      const userAccount = await this.prisma.user.upsert({
        where: { email: data.email },
        update: { ...data },
        create: { ...data },
      });
      delete userAccount.password;
      return userAccount;
    } catch (error) {
      throw error;
    }
  }
}
