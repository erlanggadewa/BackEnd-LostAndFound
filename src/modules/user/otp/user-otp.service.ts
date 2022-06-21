import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateUserOtpDto from './dto/create-user-otp.dto';

@Injectable()
export class UserOtpService {
  constructor(private readonly prisma: PrismaService) {}

  async createOtp(userOtpDto: CreateUserOtpDto) {
    const salt = await bcrypt.genSalt();
    userOtpDto.otp = await bcrypt.hash(userOtpDto.otp, salt);

    const data: Prisma.UserOtpCreateInput = userOtpDto;

    return await this.prisma.userOtp.create({ data });
  }

  async verifyOtp(userOtpDto: CreateUserOtpDto) {
    const data = await this.findLatestOtpByUserId(userOtpDto.userId);

    const isMatch = await bcrypt.compare(userOtpDto.otp, data.otp);
    if (!isMatch) {
      throw new BadRequestException('Invalid OTP');
    }
    const verifiedUser = await this.prisma.user.update({
      where: { id: userOtpDto.userId },
      data: { activeStatus: true },
    });
    delete verifiedUser.password;
    return verifiedUser;
  }

  async findLatestOtpByUserId(userId: string) {
    const data = await this.prisma.userOtp.findMany({
      where: { userId },
      distinct: ['userId'],
      orderBy: {
        createdAt: 'desc',
      },
    });
    return data[0];
  }
}
