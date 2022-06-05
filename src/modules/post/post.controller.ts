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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { SetAcceptPostDto } from './dto/set-accept-post.dto';
import { SetDonePostDto } from './dto/set-done-post.dto';
import { SetRejectPostDto } from './dto/set-reject-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('lost/set-finish')
  async setLostPostToFinish(@Body() setDonePostDto: SetDonePostDto) {
    const data = await this.postService.setLostPostToFinish(setDonePostDto);
    return { message: 'Data modified successfully', data };
  }

  @Post('lost/set-reject')
  async setLostPostToReject(@Body() setRejectPostDto: SetRejectPostDto) {
    const data = await this.postService.setLostPostToReject(setRejectPostDto);
    return { message: 'Data modified successfully', data };
  }

  @Post('found/set-accept')
  @ApiOperation({
    description:
      "API for the founder accept the another user's answer and reject all answers of the other user with not accepted answer",
    summary: "API for the founder accept the another user's answer",
  })
  async setFoundPostToAccept(@Body() setDonePostDto: SetDonePostDto) {
    const data = await this.postService.setFoundPostToAccept(setDonePostDto);
    return { message: 'Data modified successfully', data };
  }

  @Post('found/set-finish')
  @ApiOperation({
    description:
      "API for the founder accept the another user's answer and reject all answers of the other user with not accepted answer",
    summary: "API for the founder accept the another user's answer",
  })
  async setFoundPostToFinish(@Body() setAcceptPostDto: SetAcceptPostDto) {
    const data = await this.postService.setFoundPostToFinish(setAcceptPostDto);
    return { message: 'Data modified successfully', data };
  }

  @Get('my-post/found/:postId')
  @ApiOperation({
    description:
      'Find detail of selected posts made by user which have type found',
    summary: 'Find my found post',
  })
  findMyFoundPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Request() req: any,
  ) {
    return this.postService.findMyFoundPost(postId, req.user.userId);
  }

  @Get('my-post/lost/:postId')
  @ApiOperation({
    description:
      'Find detail of selected posts made by user which have type lost',
    summary: 'Find my lost post',
  })
  findMyLostPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Request() req: any,
  ) {
    return this.postService.findMyLostPost(postId, req.user.userId);
  }

  @Get('/my-post')
  @ApiOperation({
    description: "Find all user's posts based on the current logged userId",
    summary: "Find all user's posts",
  })
  findAllUserPosts(@Request() req: any) {
    return this.postService.findAllUserPosts(req.user.userId);
  }

  @Get('/following')
  @ApiOperation({
    description:
      'Find all posts that user is following based on the current logged userId',
    summary: 'Find all posts that user is following',
  })
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
