import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ExamineEntity from './entities/examine.entity';
import { CreateExamineDto } from './dto/create-examine.dto';
@Injectable()
export class ExamineService {
  constructor(
    @InjectRepository(ExamineEntity)
    private readonly examineRepository: Repository<ExamineEntity>,
  ) {}

  async createExamine(dto: CreateExamineDto): Promise<ExamineEntity> {
    const examine = new ExamineEntity();
    examine.symptomSites = dto.symptomSites;
    examine.symptomComment = dto.symptomComment;
    examine.gender = dto.gender;
    examine.birthYear = dto.birthYear;
    examine.diseaseName = dto.diseaseName;
    examine.diseaseSolution = dto.diseaseSolution;
    return this.examineRepository.save(examine);
  }

  async getExamineById(examineId: number): Promise<ExamineEntity> {
    return this.examineRepository.findOne({
      where: {
        id: examineId,
      },
    });
  }
}
