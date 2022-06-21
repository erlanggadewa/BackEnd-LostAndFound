import { forwardRef, Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { UserOtpController } from './otp/user-otp.controller';
import { UserOtpService } from './otp/user-otp.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => EmailModule)],
  controllers: [UserController, UserOtpController],
  providers: [UserService, UserOtpService],
  exports: [UserService, UserOtpService],
})
export class UserModule {}
