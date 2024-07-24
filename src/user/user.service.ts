import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { Repository } from 'typeorm';
import LoginSuccessDto from '../auth/dto/login-success.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(dto: LoginSuccessDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        providerId: dto.providerId,
      },
    });

    if (user) {
      return this.jwtService.sign(
        {
          providerId: user.providerId,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
    } else {
      const newUser = new UserEntity();
      newUser.provider = dto.provider;
      newUser.providerId = dto.providerId;
      newUser.name = dto.name;
      newUser.profileImageUrl = dto.profileImageUrl;
      await this.userRepository.save(newUser);
      return this.jwtService.sign(
        {
          providerId: dto.providerId,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
    }
  }

  async findByProviderId(providerId: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        providerId,
      },
    });
  }
}
