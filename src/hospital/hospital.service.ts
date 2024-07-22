import { Injectable } from '@nestjs/common';
import NearbyHospitalDto from './dto/nearby-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import HospitalEntity from './entities/hospital.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
  ) {}

  async findNearbyHospitals(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<NearbyHospitalDto[]> {
    const hospitals = await this.hospitalRepository.query(
      `
      SELECT *
      FROM hospitals
      WHERE ST_Distance_Sphere(
        point(longitude, latitude),
        point(?, ?)
      ) <= ?
    `,
      [longitude, latitude, longitude, latitude, radius * 1000],
    );

    const hospitalDtos = hospitals.map((hospital: HospitalEntity) => {
      const dto = plainToInstance(NearbyHospitalDto, {
        institutionName: hospital.institutionName,
        institutionType: hospital.institutionType,
        medicalDepartment: hospital.medicalDepartment,
        medicalDepartmentDoctorCount: hospital.medicalDepartmentDoctorCount,
        homepage: hospital.homepage,
        address: hospital.address,
        tel: hospital.tel,
        latitude: hospital.latitude,
        longitude: hospital.longitude,
      });
      return dto;
    });

    for (const dto of hospitalDtos) {
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new Error(`Validation failed for DTO: ${JSON.stringify(errors)}`);
      }
    }

    return hospitalDtos;
  }
}
