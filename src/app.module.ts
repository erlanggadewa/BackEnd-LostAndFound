import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { envValidationSchema } from './config/env-validation.schema';
import { AnswerModule } from './modules/answer/answer.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { QuestionModule } from './modules/question/question.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
    TerminusModule,
    PrismaModule,
    UserModule,
    PostModule,
    QuestionModule,
    AnswerModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
