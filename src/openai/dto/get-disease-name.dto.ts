import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import Gender from '../../common/enums/Gender';

export default class GetDiseaseNameDto {
  @IsArray()
  @IsString({ each: true })
  symptomSites: string[];

  @IsString()
  symptomComment: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsNumber()
  age: number;
}
