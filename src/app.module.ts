import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { GreetingsModule } from './modules/greetings/greetings.module';
import { envValidationSchema } from './config/env-validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envValidationSchema,
    }),
    TerminusModule,
    PrismaModule,
    GreetingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
