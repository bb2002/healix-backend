import { Module } from '@nestjs/common';
import { ExamineService } from './examine.service';
import { ExamineController } from './examine.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import ExamineEntity from './entities/examine.entity';

@Module({
  providers: [ExamineService],
  controllers: [ExamineController],
  imports: [TypeOrmModule.forFeature([ExamineEntity]), UserModule, JwtModule],
})
export class ExamineModule {}
