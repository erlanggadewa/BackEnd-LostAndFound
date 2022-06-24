import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateUserOtpDto from './dto/create-user-otp.dto';
import VerifyUserOtpDto from './dto/verify-user-otp.dto';

@Injectable()
export class UserOtpService {
  constructor(private readonly prisma: PrismaService) {}

  async createOtp(userOtpDto: CreateUserOtpDto) {
    try {
      const salt = await bcrypt.genSalt();
      userOtpDto.otp = await bcrypt.hash(userOtpDto.otp, salt);

      const data: Prisma.UserOtpCreateInput = userOtpDto;

      return await this.prisma.userOtp.create({ data });
    } catch (error) {
      throw error;
    }
  }

  async verifyRegisterOtp(verifyUserOtpDto: VerifyUserOtpDto) {
    const isValidOtp = await this.verifyOtp(verifyUserOtpDto);
    if (isValidOtp) {
      const verifiedUser = await this.prisma.user.update({
        where: { id: verifyUserOtpDto.userId },
        data: { activeStatus: true },
      });
      delete verifiedUser.password;
      return verifiedUser;
    }
  }

  async verifyResetOtp(verifyUserOtpDto: VerifyUserOtpDto) {
    const isValidOtp = await this.verifyOtp(verifyUserOtpDto);
    if (isValidOtp) {
      return isValidOtp;
    }
  }

  private async verifyOtp(verifyUserOtpDto: VerifyUserOtpDto) {
    const data = await this.findLatestOtpByUserId(verifyUserOtpDto.userId);

    const isMatch = await bcrypt.compare(verifyUserOtpDto.otp, data.otp);
    if (!isMatch) {
      throw new BadRequestException('Invalid OTP');
    }
    return true;
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
