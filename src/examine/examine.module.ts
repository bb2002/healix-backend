import { Module } from '@nestjs/common';
import { ExamineService } from './examine.service';
import { ExamineController } from './examine.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import ExamineEntity from './entities/examine.entity';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  providers: [ExamineService],
  controllers: [ExamineController],
  imports: [
    TypeOrmModule.forFeature([ExamineEntity]),
    UserModule,
    JwtModule,
    OpenaiModule,
  ],
  exports: [ExamineService],
})
export class ExamineModule {}
