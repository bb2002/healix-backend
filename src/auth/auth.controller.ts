import {
  Controller,
  HttpStatus,
  Put,
  Res,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import UserEntity from 'src/user/entities/user.entity';

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
  @ApiBody({
    schema: { type: 'object', properties: { token: { type: 'string' } } },
  })
  @Put('/kakao')
  async signInWithKakao(
    @Res() response: Response,
    @Body('token') token: string,
  ) {
    try {
      const dto = await this.authService.signInWithKakao(token);

      response.cookie(
        'Authorization',
        'Bearer ' + (await this.userService.signIn(dto)),
        {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
        },
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
  @ApiBody({
    schema: { type: 'object', properties: { token: { type: 'string' } } },
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
        'Bearer ' + (await this.userService.signIn(dto)),
        {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
        },
      );
      response.sendStatus(HttpStatus.OK);
    } catch (error) {
      console.error('Error during google login:', error);
      response.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/verify')
  async verifyToken(@User() user: UserEntity) {
    if (user == null) {
      return null;
    } else {
      return user;
    }
  }
}
