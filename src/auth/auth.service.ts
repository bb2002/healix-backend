import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import LoginSuccessDto from './dto/login-success.dto';
import LoginProvider from './enums/LoginProvider';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  constructor() {}

  /**
   * 카카오 서버로부터 받은 code를 통해 사용자 정보를 가져옵니다.
   * @param code 카카오 서버로부터 발급받은 코드
   * @returns 사용자의 정보를 담은 LoginSuccessDto
   */
  async signInWithKakao(code: string): Promise<LoginSuccessDto> {
    const accessToken = await this.getKakaoAccessToken(code);
    const userData = await this.getKakaoUserProfile(accessToken);
    return userData;
  }

  /**
   * 카카오 서버로부터 받은 code를 통해 액세스 토큰을 가져옵니다.
   * @param code 카카오 서버로부터 발급받은 코드
   * @returns 카카오 서버로부터 받은 액세스 토큰
   */
  async getKakaoAccessToken(code: string): Promise<string> {
    const url = 'https://kauth.kakao.com/oauth/token';

    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_API_KEY,
      redirect_uri: 'https://webapp-healix-prod.azurewebsites.net/auth/kakao',
      code: code,
    }).toString();

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const response: AxiosResponse<{ access_token: string }> =
        await axios.post(url, data, { headers });

      return response.data.access_token;
    } catch (error) {
      throw new HttpException(
        'Failed to obtain access token from Kakao',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  /**
   * 카카오 서버로부터 받은 액세스 토큰을 통해 사용자 정보를 가져옵니다.
   * @param accessToken 카카오 서버로부터 발급받은 액세스 토큰
   * @returns 사용자의 정보를 담은 LoginSuccessDto
   */
  async getKakaoUserProfile(accessToken: string): Promise<LoginSuccessDto> {
    const url = 'https://kapi.kakao.com/v2/user/me';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.get(url, { headers });

      const userData = response.data;

      const loginSuccessDto: LoginSuccessDto = {
        provider: LoginProvider.KAKAO,
        providerId: userData.id.toString(),
        name: userData.kakao_account.profile.nickname,
        profileImageUrl: userData.kakao_account.profile.thumbnail_image_url,
      };

      return loginSuccessDto;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve user profile from Kakao',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
