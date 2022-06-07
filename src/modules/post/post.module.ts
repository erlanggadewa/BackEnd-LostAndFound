import { Module } from '@nestjs/common';
import { PostFoundController } from './found/post-found.controller';
import { PostFoundService } from './found/post-found.service';
import { PostLostController } from './lost/post-lost.controller';
import { PostLostService } from './lost/post-lost.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController, PostFoundController, PostLostController],
  providers: [PostService, PostFoundService, PostLostService],
})
export class PostModule {}
