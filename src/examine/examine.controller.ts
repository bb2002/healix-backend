import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateExamineDto,
  RequestCreateExamineDto,
  ResponseCreateExamineDto,
} from './dto/create-examine.dto';
import { ExamineService } from './examine.service';
import { OpenaiService } from '../openai/openai.service';
import { plainToInstance } from 'class-transformer';
import GetDiseaseNameDto from '../openai/dto/get-disease-name.dto';
import { symptomToRealName } from '../common/enums/Symptom';
import { validateOrReject } from 'class-validator';

@ApiTags('Examine')
@Controller('examine')
export class ExamineController {
  constructor(
    private readonly examineService: ExamineService,
    private readonly openAIService: OpenaiService,
  ) {}

  @ApiOperation({
    summary: '사용자 진찰',
    description: '사용자의 증상을 파악하고 병명과 해결법을 AI 로 제시합니다.',
  })
  @ApiCreatedResponse({
    description: '진찰 성공',
    type: ResponseCreateExamineDto,
  })
  @ApiInternalServerErrorResponse()
  @Post('/')
  async examine(@Body() dto: RequestCreateExamineDto) {
    const getDiseaseNameDto = plainToInstance(GetDiseaseNameDto, {
      symptomSites: dto.symptomSites.map((val) => symptomToRealName(val)),
      symptomComment: dto.symptomComment,
      birthYear: dto.birthYear,
    });
    await validateOrReject(getDiseaseNameDto);

    const diseaseName =
      await this.openAIService.getDiseaseName(getDiseaseNameDto);
    if (!diseaseName) {
      throw new InternalServerErrorException(
        'openAIService.getDiseaseName() return null',
      );
    }

    const diseaseSolution = this.openAIService.getDiseaseSolution(diseaseName);
    if (!diseaseSolution) {
      throw new InternalServerErrorException(
        'openAIService.getDiseaseSolution() return null',
      );
    }

    const examine = await this.examineService.createExamine(
      plainToInstance(CreateExamineDto, {
        ...dto,
        diseaseName,
        diseaseSolution,
      }),
    );

    return plainToInstance(ResponseCreateExamineDto, {
      examineId: examine.id,
      diseaseName,
      diseaseSolution,
    });
  }
}
