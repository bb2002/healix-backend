import LoginProvider from '../enums/LoginProvider';

export default class LoginSuccessDto {
  provider: LoginProvider;
  uniqueId: string;
  name: string;
  profileImageUrl: string;
}
