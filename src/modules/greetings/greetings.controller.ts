import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { GreetingsService } from './greetings.service';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { UpdateGreetingDto } from './dto/update-greeting.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('greetings')
@ApiTags('Greeting')
export class GreetingsController {
  constructor(private readonly greetingsService: GreetingsService) {}

  @Post()
  async create(@Body() createGreetingDto: CreateGreetingDto) {
    return this.greetingsService.create(createGreetingDto)
  }

  @Get()
  findAll() {
    return this.greetingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.greetingsService.findOne(id)
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateGreetingDto: UpdateGreetingDto,
  ) {
    return this.greetingsService.update(id, updateGreetingDto)
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.greetingsService.remove(id)
  }
}
