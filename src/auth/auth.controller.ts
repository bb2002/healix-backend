import { Controller, HttpStatus, Put, Get, Res, Query } from '@nestjs/common';
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
  @Get('/kakao')
  async signInWithKakao(
    @Res() response: Response,
    @Query('code') code: string, // 카카오 서버로부터 받아온 카카오 인증 코드
  ) {
    try {
      const dto = await this.authService.signInWithKakao(code);

      response.cookie(
        'Authorization',
        'Bearer ' + this.userService.signIn(dto),
      );
      response.sendStatus(HttpStatus.OK);
    } catch (error) {
      console.error('Error during Kakao login:', error);
      response.sendStatus(HttpStatus.UNAUTHORIZED);
    }
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
