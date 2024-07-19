import LoginProvider from '../enums/LoginProvider';

export default class LoginSuccessDto {
  provider: LoginProvider;
  providerId: string;
  name: string;
  profileImageUrl: string;
}
