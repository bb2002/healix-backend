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

export class RequestCreateExamineDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Symptom, { each: true })
  symptomSites: Symptom[];

  @IsString()
  @IsOptional()
  symptomComment: string;

  @IsEnum(Gender)
  gender: Gender;

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
  @IsInt()
  examineId: number;

  @IsString()
  diseaseName: string;

  @IsString()
  diseaseSolution: string;
}
