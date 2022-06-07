import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FilterSearchPostDto } from '../dto/search-post.dto';
import { AcceptFoundPostDto } from './dto/accept-found-post.dto';
import { DoneFoundPostDto } from './dto/done-found-post.dto';
import { RejectAnswerFoundPostDto } from './dto/reject-answer-found-post.dto';
import { PostFoundService } from './post-found.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@ApiTags('Post Found')
@Controller('posts/found')
export class PostFoundController {
  constructor(private readonly postFoundService: PostFoundService) {}

  @Get('search')
  @ApiOperation({
    summary: 'Get all found posts with given filter keyword',
    description:
      'Filter keyword which can be use is only title, description, chronology',
  })
  searchFoundPost(@Query() filterSearchPostDto: FilterSearchPostDto) {
    return this.postFoundService.searchFoundPost(filterSearchPostDto);
  }

  @Post('accept')
  @ApiOperation({
    description:
      "API for the founder accept the another user's answer and reject all answers of the other user with not accepted answer",
    summary: "API for the founder accept the another user's answer",
  })
  async setFoundPostToAccept(@Body() donePostDto: DoneFoundPostDto) {
    const data = await this.postFoundService.setFoundPostToAccept(donePostDto);
    return { message: 'Data modified successfully', data };
  }

  @Post('finish')
  @ApiOperation({
    summary:
      'API for the owner collect info contact of the founder and set finish the post',
    description:
      'This API will close the post, make it become not visible again in news search, and put this post into history',
  })
  async setFoundPostToFinish(@Body() acceptPostDto: AcceptFoundPostDto) {
    const data = await this.postFoundService.setFoundPostToFinish(
      acceptPostDto,
    );
    return { message: 'Data modified successfully', data };
  }

  @Post('reject')
  @ApiOperation({
    summary: 'API for to reject the post maker answer',
    description:
      'This API will reject the answer we give to the creator of the found post',
  })
  async setFoundPostToReject(
    @Body() rejectAnswerFoundPostDto: RejectAnswerFoundPostDto,
  ) {
    const data = await this.postFoundService.setFoundPostToReject(
      rejectAnswerFoundPostDto,
    );
    return { message: 'Data modified successfully', data };
  }
}
