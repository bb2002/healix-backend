import { IsNumber, IsString } from 'class-validator';

export class SortRecommendHospitals {
  @IsNumber()
  hospitalId: number;

  @IsString()
  reason: string;
}
