import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailConfirmationService } from '../email/email-confirmation.service';
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
    private readonly emailConfirmationService: EmailConfirmationService,
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
      userRole: user.role,
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '60s',
        secret: this.configService.get('JWT_SECRET'),
      }),
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const user: CreateUserDto = registerUserDto;
    const userQuery = await this.userService.findOneByEmail(user.email);
    if (userQuery) {
      delete userQuery.password;
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `User already exists`,
        user: userQuery,
      });
    }

    if (registerUserDto.password != registerUserDto.confirmPassword) {
      throw new BadRequestException("Passwords doesn't not match");
    }

    delete registerUserDto.confirmPassword;
    const createdUser = await this.userService.create(user);

    await this.emailConfirmationService.sendVerificationLink({
      userId: createdUser.id,
      email: createdUser.email,
    });

    return createdUser;
  }
}
