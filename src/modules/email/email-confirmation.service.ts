import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateOtpView } from 'src/common/template/otp-verification.view';
import { UserOtpService } from '../user/otp/user-otp.service';
import VerificationEmailDto from './dto/verification-email.dto';
import { NodemailerService } from './nodemailer.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly emailService: NodemailerService,
    private readonly userOtpService: UserOtpService,
  ) {}

  public async sendVerificationLink(verificationDto: VerificationEmailDto) {
    try {
      const otp = this.generateOtp();

      await this.userOtpService.createOtp({
        userId: verificationDto.userId,
        otp,
      });

      const html = generateOtpView(otp);

      return await this.emailService.sendMail({
        to: verificationDto.email,
        subject: 'Account confirmation',
        html,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to send confirmation email to ${verificationDto.email}`,
      );
    }
  }

  private generateOtp() {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }
}
