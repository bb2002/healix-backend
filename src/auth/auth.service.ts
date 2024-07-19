import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import LoginSuccessDto from './dto/login-success.dto';
import LoginProvider from './enums/LoginProvider';
import axios from 'axios';

@Injectable()
export class AuthService {
  async signInWithGoogle(token: string): Promise<LoginSuccessDto> {
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.GOOGLE_API_KEY}`,
        { idToken: token },
      );

      if (response.data && response.data.users) {
        const userProfile = response.data.users[0];
        const dto = {
          provider: LoginProvider.GOOGLE,
          providerId: userProfile.sub,
          name: userProfile.name,
          profileImageUrl: userProfile.picture,
        } as LoginSuccessDto;

        return dto;
      }
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
