import { Injectable } from '@nestjs/common';
import NearbyHospitalDto from './dto/nearby-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import HospitalEntity from './entities/hospital.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import CreateAppointmentDto from './dto/creat-appointment.dto';
import AppointmentEntity from './entities/appointment.entity';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  async findNearbyHospitals(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<NearbyHospitalDto[]> {
    const hospitals = await this.hospitalRepository
      .createQueryBuilder('hospital')
      .where(
        `ST_Distance_Sphere(
          point(hospital.longitude, hospital.latitude),
          point(:longitude, :latitude)
        ) <= :radius`,
        { longitude, latitude, radius: radius * 1000 },
      )
      .getMany();

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

  async createAppointment(
    hospitalId: number,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const hospital = await this.hospitalRepository.findOne({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new Error('Hospital not found');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      hospital,
    });

    return this.appointmentRepository.save(appointment);
  }
}
