import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationService } from 'src/modules/email/email-confirmation.service';
import CreateUserOtpDto from './dto/create-user-otp.dto';
import ResendUserOtpDto from './dto/resend-user-otp.dto';
import { UserOtpService } from './user-otp.service';

@ApiTags('Authentication')
@Controller('user/otp')
export class UserOtpController {
  constructor(
    private readonly userOtpService: UserOtpService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @ApiOperation({ summary: 'Resend or create OTP' })
  @Post()
  async createOtp(@Body() resendUserOtpDto: ResendUserOtpDto) {
    const { email, userId } = resendUserOtpDto;

    const dataVerification =
      await this.emailConfirmationService.sendVerificationLink({
        email,
        userId,
      });

    return {
      message: `Success send email to ${email}`,
      data: dataVerification,
    };
  }

  @ApiOperation({ summary: `Verify user's OTP` })
  @Post('verify')
  async verifyOtp(@Body() userOtpDto: CreateUserOtpDto) {
    const data = await this.userOtpService.verifyOtp(userOtpDto);
    return { data, message: 'User account verified' };
  }
}
