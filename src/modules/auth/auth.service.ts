import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

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

  async login(user: any) {
    user = await this.userService.findOneByEmail(user.email);
    const payload = { sub: user.id, email: user.email };

    return {
      userId: user.id,
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '60s',
        secret: this.configService.get('JWT_SECRET'),
      }),
    };
  }

  async register(user: any) {
    if (user.password != user.confirmPassword) {
      throw new BadRequestException("Passwords doesn't not match");
    }
    delete user.confirmPassword;
    return await this.userService.create(user);
  }
}
