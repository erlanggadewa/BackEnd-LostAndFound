import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailConfirmationService } from './email-confirmation.service';
import { NodemailerService } from './nodemailer.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [NodemailerService, EmailConfirmationService],
  exports: [NodemailerService, EmailConfirmationService],
})
export class EmailModule {}
