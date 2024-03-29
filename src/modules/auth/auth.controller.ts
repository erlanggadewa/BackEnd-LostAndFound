import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RecreatePasswordUserDto } from './dto/recreate-password-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetUserPasswordDto } from './dto/reset-password-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const data = await this.authService.register(registerUserDto);
    return { data, message: 'User created successfully' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetUserPasswordDto: ResetUserPasswordDto) {
    const data = await this.authService.resetPassword(resetUserPasswordDto);
    return { data, message: 'Successfully sent otp code to reset password' };
  }

  @Patch('reset-password')
  async updatePassword(
    @Body() recreatePasswordUserDto: RecreatePasswordUserDto,
  ) {
    const data = await this.userService.recreatePassword(
      recreatePasswordUserDto,
    );
    return { data, message: 'Successfully update password user' };
  }
}
