import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmbeddingRequestDto {
  @ApiProperty({
    description: '임베딩할 단어',
    type: String,
    example: '머리',
  })
  @IsNotEmpty()
  @IsString()
  input: string;
}

export class EmbeddingResponseDto {
  @ApiProperty({
    description: '유사한 단어 목록',
    type: [String],
    example: ['두통', '뇌졸중', '치통'],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  similarWords: string[];
}
