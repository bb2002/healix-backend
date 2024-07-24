import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule],
  exports: [UserService],
})
export class UserModule {}
