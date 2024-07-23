import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import ExamineEntity from './entities/examine.entity';
import { ExamineDto } from './dto/examine.dto';
@Injectable()
export class ExamineService {
  constructor(
    @InjectRepository(ExamineEntity)
    private readonly examineRepository: Repository<ExamineEntity>,
  ) {}

  async addExamine(
    examineDto: ExamineDto,
    user: UserEntity,
  ): Promise<ExamineEntity> {
    const examine = new ExamineEntity();
    examine.user = user;
    examine.symptoms = examineDto.symptoms;
    examine.detailedSymptom = examineDto.detailedSymptom;
    examine.gender = examineDto.gender;
    examine.birthYear = examineDto.birthYear;

    await this.examineRepository.save(examine);
    return examine;
  }
}
