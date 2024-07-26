import Symptom from '../../common/enums/Symptom';
import Gender from '../../common/enums/Gender';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateExamineDto {
  @ApiProperty({
    description: '증상이 있는 부위 목록',
    enum: Symptom,
    isArray: true,
    example: ['Head', 'Neck'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Symptom, { each: true })
  symptomSites: Symptom[];

  @ApiProperty({
    description: '증상 상세',
    type: String,
    example: '목이 아프고 따끔거려요. 3주 정도 되었어요.',
  })
  @IsString()
  @IsOptional()
  symptomComment: string;

  @ApiProperty({
    description: '성별',
    enum: Gender,
    example: Gender.WOMAN,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: '태어난년도',
    type: Number,
    example: 2002,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear: number;
}

export class CreateExamineDto extends RequestCreateExamineDto {
  @IsString()
  diseaseName: string;

  @IsString()
  diseaseSolution: string;
}

export class ResponseCreateExamineDto {
  @ApiProperty({
    description: '진찰 고유 번호, 이 값으로 진찰을 다시 확인 할 수 있음',
  })
  @IsInt()
  examineId: number;

  @ApiProperty({
    description: '추정되는 병명',
  })
  @IsString()
  diseaseName: string;

  @ApiProperty({
    description: '그 병에 대한 조언',
  })
  @IsString()
  diseaseSolution: string;
}
