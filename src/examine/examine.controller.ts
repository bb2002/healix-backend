import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExamineDto } from './dto/examine.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import UserEntity from 'src/user/entities/user.entity';
import { ExamineService } from './examine.service';
import { User } from 'src/common/decorators/user.decorator';
import { validate } from 'class-validator';

@ApiTags('Examine')
@Controller('examine')
export class ExamineController {
  constructor(private readonly examineService: ExamineService) {}

  @ApiOperation({
    summary: '사용자 입력 데이터 저장',
    description: '사용자의 입력 데이터를 DB에 저장합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        symptoms: { type: 'array', items: { type: 'string' } },
        detailedSymptoms: { type: 'string', nullable: true },
        gender: { type: 'string' },
        birthYear: { type: 'number' },
      },
    },
  })
  @UseGuards(AuthGuard)
  @Post()
  async addUserInput(@Body() dto: ExamineDto, @User() user: UserEntity) {
    await validate(dto);
    return await this.examineService.addExamine(dto, user);
  }
}
