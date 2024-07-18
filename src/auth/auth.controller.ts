import { Controller, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Put('/kakao')
  signInWithKakao() {
    // return this.authService.signInWithKakao();
  }

  @Put('/google')
  signInWithGoogle() {
    // return this.authService.signInWithGoogle();
  }
}
