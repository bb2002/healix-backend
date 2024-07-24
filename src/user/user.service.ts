import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entities/user.entitiy';
import { Repository } from 'typeorm';
import LoginSuccessDto from '../auth/dto/login-success.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: LoginSuccessDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        providerId: dto.providerId,
      },
    });

    if (user) {
      return this.jwtService.sign({
        providerId: user.providerId,
      });
    } else {
      const newUser = new UserEntity();
      newUser.providerId = dto.providerId;
      newUser.name = dto.name;
      newUser.profileImageUrl = dto.profileImageUrl;
      await this.userRepository.save(newUser);
      return this.jwtService.sign({
        providerId: user.providerId,
      });
    }
  }

  async findUserById(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }
}
