import { Module } from '@nestjs/common';
import { AnswerModule } from '../answer/answer.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [AnswerModule],
})
export class PostModule {}
