import { Module } from '@nestjs/common';
import { PostFoundController } from './found/post-found.controller';
import { PostFoundService } from './found/post-found.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController, PostFoundController],
  providers: [PostService, PostFoundService],
})
export class PostModule {}
