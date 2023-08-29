import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { IUser } from 'src/user/type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY',
    });
  }

  async validate(payload: IUser) {
    const user = await this.userService.getUser({ email: payload.email });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
