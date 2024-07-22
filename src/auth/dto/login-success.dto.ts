import LoginProvider from '../../common/enums/LoginProvider';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export default class LoginSuccessDto {
  @IsEnum(LoginProvider)
  @IsNotEmpty()
  provider: LoginProvider;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  profileImageUrl: string;
}
