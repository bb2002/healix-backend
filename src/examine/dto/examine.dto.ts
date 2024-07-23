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

export class ExamineDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Symptom, { each: true })
  symptoms: Symptom[];

  @IsString()
  @IsOptional()
  detailedSymptom: string;

  @IsEnum(Gender)
  gender: Gender;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear: number;
}
