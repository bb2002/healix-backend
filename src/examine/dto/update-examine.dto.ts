import { IsString } from 'class-validator';

export class UpdateExamineDto {
  @IsString()
  diseaseName: string;

  @IsString()
  diseaseSolution: string;
}
