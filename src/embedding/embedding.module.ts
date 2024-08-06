import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbeddingController } from './embedding.controller';
import { EmbeddingService } from './embedding.service';
import { Embedding } from './entities/embedding.entity';
import { OpenaiService } from 'src/openai/openai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Embedding])],
  controllers: [EmbeddingController],
  providers: [EmbeddingService, OpenaiService],
})
export class EmbeddingModule {}
