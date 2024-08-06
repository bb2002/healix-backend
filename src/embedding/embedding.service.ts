import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Embedding } from './entities/embedding.entity';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class EmbeddingService {
  constructor(
    @InjectRepository(Embedding)
    private embeddingsRepository: Repository<Embedding>,
    @Inject(OpenaiService)
    private readonly openaiService: OpenaiService,
  ) {}

  async findSimilarEmbeddings(input: string): Promise<string[]> {
    const embeddingVector = await this.openaiService.getEmbedding(input);
    return this.findTopThreeSimilar(embeddingVector);
  }

  private async findTopThreeSimilar(inputVector: number[]): Promise<string[]> {
    const embeddings = await this.embeddingsRepository.find();
    const results = embeddings
      .map((e) => ({
        name: e.name,
        similarity: this.cosineSimilarity(inputVector, JSON.parse(e.vector)),
      }))
      .sort((a, b) => b.similarity - a.similarity);
    const topThreeNames = results.slice(0, 3).map((item) => item.name);
    return topThreeNames;
  }

  private dotProduct(vec1: number[], vec2: number[]): number {
    return vec1.reduce((acc, curr, idx) => acc + curr * vec2[idx], 0);
  }

  private vectorNorm(vec: number[]): number {
    return Math.sqrt(vec.reduce((acc, curr) => acc + curr * curr, 0));
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dot = this.dotProduct(vec1, vec2);
    const norm1 = this.vectorNorm(vec1);
    const norm2 = this.vectorNorm(vec2);
    return dot / (norm1 * norm2);
  }
}
