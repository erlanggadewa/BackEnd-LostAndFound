import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('found/user')
  findAllUserFoundPost(@Request() req: any) {
    return this.postService.findAllUserFoundPost(req.user.userId);
  }

  @Get('found/following')
  async findAllFollowingFoundPost(
    @Request() req: any,
    @Query() filter: FilterPostDto,
  ) {
    const data = await this.postService.findAllFollowingFoundPost(
      req.user.userId,
      filter,
    );
    return data;
  }

  @Get(':postId/social-media')
  findSocialMediaByPostId(@Param('postId', ParseUUIDPipe) id: string) {
    return this.postService.findSocialMediaByPostId(id);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':postId')
  findOne(@Param('postId', ParseUUIDPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const data = await this.postService.create(createPostDto);
    return { data, message: 'Post created successfully' };
  }

  @Patch(':postId')
  async update(
    @Param('postId', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const data = await this.postService.update(id, updatePostDto);
    return { data, message: 'Post updated successfully' };
  }

  @Delete(':postId')
  async remove(@Param('postId', ParseUUIDPipe) id: string) {
    const data = await this.postService.remove(id);
    return { data, message: 'Post removed successfully' };
  }
}
