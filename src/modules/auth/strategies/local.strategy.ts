import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    if (!user) throw new UnauthorizedException(`User not found`);

    if (!user.activeStatus)
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `User with id ${user.id} is not active`,
        user,
      });

    return user;
  }
}
