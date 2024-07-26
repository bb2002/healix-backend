import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [OpenaiService],
  imports: [UserModule, JwtModule],
  exports: [OpenaiService],
})
export class OpenaiModule {}
