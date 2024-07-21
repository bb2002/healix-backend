import { Controller, HttpStatus, Put, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import LoginSuccessDto from './dto/login-success.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import LoginProvider from './enums/LoginProvider';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: '카카오 계정으로 로그인',
    description: '카카오 API를 통해 카카오 계정 로그인을 수행합니다.',
  })
  @Put('/kakao')
  signInWithKakao(@Res() response: Response) {
    // 카카오 인증 토큰을 받고, 그 토큰을 통해 유저의 프로필을 읽고
    // 읽은 프로필을 LoginSuccessDto 에 담은 다음
    // dto = this.authService.signInWithKakao();

    const dto = {
      provider: LoginProvider.KAKAO,
      providerId: 'P@ssw0rd',
      name: 'KakaoUser',
      profileImageUrl: 'https://www.daum.net',
    } as LoginSuccessDto;
    response.cookie('Authorization', 'Bearer ' + this.userService.signIn(dto));
    response.sendStatus(HttpStatus.OK);
  }

  @ApiOperation({
    summary: '구글 계정으로 로그인',
    description: '구글 API를 통해 구글 계정 로그인을 수행합니다.',
  })
  @Put('/google')
  async signInWithGoogle(
    @Res() response: Response,
    @Body('token') token: string,
  ) {
    try {
      const dto = await this.authService.signInWithGoogle(token);
      response.cookie(
        'Authorization',
        'Bearer ' + this.userService.signIn(dto),
      );
      response.sendStatus(HttpStatus.OK);
    } catch (error) {
      response.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  }
}
