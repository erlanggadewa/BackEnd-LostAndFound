import { Module } from '@nestjs/common';
import { GreetingsService } from './greetings.service';
import { GreetingsController } from './greetings.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GreetingsController],
  providers: [GreetingsService],
})
export class GreetingsModule {}
