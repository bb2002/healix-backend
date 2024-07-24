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
    const authorization = request.cookies['Authorization'];

    if (!authorization) {
      return false;
    }

    console.log('jwtsec: ', this.configService.get<string>('JWT_SECRET'));

    const payload = await this.jwtService.verifyAsync(authorization, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    if (!payload) {
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
