import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/my-post')
  @ApiOperation({
    description: "Find all user's posts based on the current logged userId",
    summary: "Find all user's posts",
  })
  findAllUserPosts(@User('userId', ParseUUIDPipe) userId: string) {
    return this.postService.findAllUserPosts(userId);
  }

  @Get('/history')
  @ApiOperation({
    description:
      "Find all user's history based on activity of the current logged userId",
  })
  findAllHistoryPost(@User('userId', ParseUUIDPipe) userId: string) {
    return this.postService.findAllHistoryPost(userId);
  }

  @Get('/following')
  @ApiOperation({
    description:
      'Find all posts that user is following based on the current logged userId',
    summary: 'Find all posts that user is following',
  })
  findAllFollowingPost(@User('userId', ParseUUIDPipe) userId: string) {
    return this.postService.findAllFollowingPost(userId);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const data = await this.postService.create(createPostDto);
    return { data, message: 'Post created successfully' };
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':postId')
  findOne(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.postService.findOne(postId);
  }

  @Patch(':postId')
  async update(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const data = await this.postService.update(postId, updatePostDto);
    return { data, message: 'Post updated successfully' };
  }

  @Delete(':postId')
  async remove(@Param('postId', ParseUUIDPipe) postId: string) {
    const data = await this.postService.remove(postId);
    return { data, message: 'Post removed successfully' };
  }
}
