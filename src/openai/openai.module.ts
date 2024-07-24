import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [OpenaiService],
  controllers: [OpenaiController],
  imports: [UserModule, JwtModule],
})
export class OpenaiModule {}
