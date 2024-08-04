import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmbeddingService } from './embedding.service';

@ApiTags('Embedding')
@Controller('embedding')
export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  @ApiOperation({
    summary: '자동완성 기능',
    description: '사용자의 입력에 대해 자동완성을 제공합니다.',
  })
  @ApiCreatedResponse({
    description: '임베딩 성공',
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청',
  })
  @Get()
  async embedding(@Query('input') input: string) {
    if (!input) {
      throw new HttpException(
        'Input query parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const similarEmbeddings =
      await this.embeddingService.findSimilarEmbeddings(input);
    return { data: similarEmbeddings };
  }
}
