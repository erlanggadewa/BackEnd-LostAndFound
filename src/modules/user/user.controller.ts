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
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiExcludeEndpoint()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);
    return { data, message: 'User created successfully' };
  }

  @ApiExcludeEndpoint()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch(':userId')
  async update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const data = await this.userService.update(userId, updateUserDto);
    return { data, message: 'User updated successfully' };
  }

  @Delete(':userId')
  async remove(@Param('userId', ParseUUIDPipe) userId: string) {
    const data = await this.userService.remove(userId);
    return { data, message: 'User deleted successfully' };
  }
}
