import { IsNumber } from 'class-validator';
import HospitalEntity from '../../hospital/entities/hospital.entity';

export class HospitalWithDistanceDto {
  hospital: HospitalEntity;

  @IsNumber()
  distance: number;
}
