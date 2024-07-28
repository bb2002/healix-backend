import { HttpStatus, Injectable } from '@nestjs/common';
import LoginSuccessDto from './dto/login-success.dto';
import LoginProvider from '../common/enums/LoginProvider';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signInWithKakao(accessToken: string): Promise<LoginSuccessDto> {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = response?.data;

    const dto = plainToInstance(LoginSuccessDto, {
      provider: LoginProvider.KAKAO,
      providerId: userData?.id?.toString(),
      name: userData?.kakao_account?.profile?.nickname,
      profileImageUrl: userData?.kakao_account?.profile?.thumbnail_image_url,
    });
    await validate(dto);

    return dto;
  }

  async signInWithGoogle(token: string): Promise<LoginSuccessDto> {
    const response = await axios.post(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
    );

    const userProfile = response?.data;
    const dto = plainToInstance(LoginSuccessDto, {
      provider: LoginProvider.GOOGLE,
      providerId: userProfile?.sub,
      name: userProfile?.name,
      profileImageUrl: userProfile?.picture,
    });
    await validate(dto);

    return dto;
  }

  async setAuthorizationCookie(response: Response, payload: LoginSuccessDto) {
    response.cookie(
      'Authorization',
      'Bearer ' + (await this.userService.signIn(payload)),
      {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    );
    response.sendStatus(HttpStatus.OK);
  }
}
