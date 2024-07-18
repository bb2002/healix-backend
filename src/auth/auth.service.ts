import { Injectable } from '@nestjs/common';
import LoginSuccessDto from './dto/login-success.dto';
import LoginProvider from './enums/LoginProvider';

@Injectable()
export class AuthService {
  async signInWithGoogle(user: any): Promise<LoginSuccessDto> {
    const loginSuccessDto: LoginSuccessDto = {
      provider: LoginProvider.GOOGLE,
      uniqueId: user.email,
      name: `${user.firstName} ${user.lastName}`,
      profileImageUrl: user.photo,
    };
    return loginSuccessDto;
  }
}
