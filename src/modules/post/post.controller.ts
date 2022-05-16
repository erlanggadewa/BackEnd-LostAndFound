import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @Get('my-post/found/:postId')
  findMyFoundPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Request() req: any,
  ) {
    return this.postService.findMyFoundPost(postId, req.user.userId);
  }

  @Get('my-post/lost/:postId')
  findMyLostPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Request() req: any,
  ) {
    return this.postService.findMyLostPost(postId, req.user.userId);
  }

  @Get('/my-post')
  findAllUserPosts(@Request() req: any) {
    return this.postService.findAllUserPosts(req.user.userId);
  }

  @Get('/following')
  findAllFollowingPost(@Request() req: any) {
    return this.postService.findAllFollowingPost(req.user.userId);
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
