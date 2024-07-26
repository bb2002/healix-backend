import { IsArray, IsEnum, IsInt, IsString, Max, Min } from 'class-validator';
import Gender from '../../common/enums/Gender';

export default class GetDiseaseNameDto {
  @IsArray()
  @IsString({ each: true })
  symptomSites: string[];

  @IsString()
  symptomComment: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear: number;
}
