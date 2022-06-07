import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DonePostDto } from '../dto/done-post.dto';
import { FilterSearchPostDto } from './../dto/search-post.dto';
import { RejectAnswerLostPostDto } from './dto/reject-answer-found-post.dto';
import { PostLostService } from './post-lost.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@ApiTags('Post Lost')
@Controller('posts/lost')
export class PostLostController {
  constructor(private readonly postLostService: PostLostService) {}

  @Get('lost/search')
  @ApiOperation({
    summary: 'Get all lost posts with given filter keyword',
    description:
      'Filter keyword which can be use is only title, description, chronology',
  })
  searchLostPost(@Query() filterSearchPostDto: FilterSearchPostDto) {
    return this.postLostService.searchLostPost(filterSearchPostDto);
  }

  @Get('news')
  @ApiOperation({ summary: 'Get all lost post for news tab' })
  getNewsLostPosts() {
    return this.postLostService.getNewsLostPosts();
  }

  @Post('finish')
  @ApiOperation({
    summary: 'API for to accept the claimer answer',
    description:
      'This API will close the post, make it become not visible again in news search, and put this post into history',
  })
  async setLostPostToFinish(@Body() donePostDto: DonePostDto) {
    const data = await this.postLostService.setLostPostToFinish(donePostDto);
    return { message: 'Data modified successfully', data };
  }

  @Post('reject')
  @ApiOperation({
    summary: 'API for to reject the post maker answer',
    description:
      'This API will reject the answer we give to the creator of the lost post',
  })
  async setLostPostToReject(
    @Body() rejectAnswerLostPostDto: RejectAnswerLostPostDto,
  ) {
    const data = await this.postLostService.setLostPostToReject(
      rejectAnswerLostPostDto,
    );
    return { message: 'Data modified successfully', data };
  }
}
