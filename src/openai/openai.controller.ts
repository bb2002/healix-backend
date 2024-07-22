import { Controller, Get, Query } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import Gender from 'src/common/enums/Gender';
import { plainToInstance } from 'class-transformer';
import GetDiseaseNameDto from './dto/get-disease-name.dto';
import { validate } from 'class-validator';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openAIService: OpenaiService) {}

  @Get('/disease-name')
  async testGetDiseaseName(
    @Query('symptomSites') symptomSites: string,
    @Query('symptomComment') symptomComment,
    @Query('gender') gender,
    @Query('age') age,
  ) {
    const dto = plainToInstance(GetDiseaseNameDto, {
      symptomSites: symptomSites.split(','),
      symptomComment: symptomComment,
      gender: gender == 'm' ? Gender.MAN : Gender.WOMAN,
      age: Number(age),
    });
    await validate(dto);
    return {
      // sym: await this.openAIService.getDiseaseName(dto),
      sym: '돈들어서이건뺌',
    };
  }

  @Get('/disease-detail')
  async testGetDiseaseDetail(@Query('diseaseName') diseaseName: string) {
    return {
      detail: diseaseName + '돈들어서 이건 뺌',
    };
  }
}
