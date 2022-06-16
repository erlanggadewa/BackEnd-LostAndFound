import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorator/user.decorator';
import { PaginationDto } from 'src/common/global-dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DonePostDto } from '../dto/done-post.dto';
import { FilterSearchPostDto } from './../dto/search-post.dto';
import { InsertAnswerLostPostDto } from './dto/insert-answer-lost-post.dto';
import { RejectAnswerLostPostDto } from './dto/reject-answer-found-post.dto';
import { PostLostService } from './post-lost.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@ApiTags('Post Lost')
@Controller('posts/lost')
export class PostLostController {
  constructor(private readonly postLostService: PostLostService) {}

  @Post('answer')
  @ApiOperation({
    description:
      'Insert answer to lost post. Set statusAnswer to Waiting and set statusQuestion to Answered',
    summary: 'answer the lost post question',
  })
  answerLostPost(
    @Body() insertAnswerLostPostDto: InsertAnswerLostPostDto,
    @User('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.postLostService.answerLostPost(insertAnswerLostPostDto, userId);
  }

  @Get('my-post/:postId')
  @ApiOperation({
    description:
      'Find detail of selected posts made by user which have type lost',
    summary: 'Find my lost post',
  })
  findMyLostPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @User('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.postLostService.findMyLostPost(postId, userId);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Get all lost posts with given filter keyword',
    description:
      'Filter keyword which can be use is only title, description, chronology',
  })
  searchLostPost(
    @Query() filterSearchPostDto: FilterSearchPostDto,
    @User('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.postLostService.searchLostPost(filterSearchPostDto, userId);
  }

  @Get('news')
  @ApiOperation({ summary: 'Get all lost post for news tab' })
  getNewsLostPosts(
    @Query() paginationDto: PaginationDto,
    @User('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.postLostService.getNewsLostPosts(paginationDto, userId);
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
