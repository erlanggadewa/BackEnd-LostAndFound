import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findOneByEmail(loginUserDto.email);
    const payload = { sub: user.id, email: user.email };

    return {
      userId: user.id,
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '60s',
        secret: this.configService.get('JWT_SECRET'),
      }),
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    if (registerUserDto.password != registerUserDto.confirmPassword) {
      throw new BadRequestException("Passwords doesn't not match");
    }
    delete registerUserDto.confirmPassword;
    const user: CreateUserDto = registerUserDto;
    return await this.userService.create(user);
  }
}
