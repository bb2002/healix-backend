import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    // 토큰을 구하는 Strategy 를 명시
    let accessToken: string | null = null;
    if (request.cookies['Authorization']) {
      accessToken = request.cookies['Authorization'];
    } else if (request.headers['authorization']) {
      accessToken = request.headers['authorization'];
    }

    if (!accessToken || !accessToken.startsWith('Bearer ')) {
      return false;
    } else {
      accessToken = accessToken.split('Bearer ')[1];
    }

    let payload: { providerId: string } | null;
    try {
      payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (ex) {
      return false;
    }

    const user = await this.userService.findByProviderId(payload['providerId']);
    if (!user) {
      return false;
    }

    request['user'] = user;
    return true;
  }
}
