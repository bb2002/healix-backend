import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import Gender from '../common/enums/Gender';
import { plainToInstance } from 'class-transformer';
import GetDiseaseNameDto from './dto/get-disease-name.dto';
import { validate } from 'class-validator';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import UserEntity from '../user/entities/user.entity';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openAIService: OpenaiService) {}

  @UseGuards(AuthGuard)
  @Get('/disease-name')
  async testGetDiseaseName(
    @Query('symptomSites') symptomSites: string,
    @Query('symptomComment') symptomComment,
    @Query('gender') gender,
    @Query('age') age,
    @User() user: UserEntity,
  ) {
    const dto = plainToInstance(GetDiseaseNameDto, {
      symptomSites: symptomSites.split(','),
      symptomComment: symptomComment,
      gender: gender == 'm' ? Gender.MAN : Gender.WOMAN,
      age: Number(age),
    });
    await validate(dto);
    console.log(user);
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
