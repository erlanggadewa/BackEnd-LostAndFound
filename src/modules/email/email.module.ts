import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { EmailConfirmationService } from './email-confirmation.service';
import { NodemailerService } from './nodemailer.service';

@Module({
  imports: [ConfigModule, forwardRef(() => UserModule)],
  controllers: [],
  providers: [NodemailerService, EmailConfirmationService],
  exports: [NodemailerService, EmailConfirmationService],
})
export class EmailModule {}
