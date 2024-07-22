import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class NearbyHospitalDto {
  @IsString()
  @IsNotEmpty()
  institutionName: string;

  @IsString()
  @IsNotEmpty()
  institutionType: string;

  @IsString()
  @IsNotEmpty()
  medicalDepartment: string;

  @IsNumber()
  @IsNotEmpty()
  medicalDepartmentDoctorCount: number;

  @IsString()
  homepage?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  tel?: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
