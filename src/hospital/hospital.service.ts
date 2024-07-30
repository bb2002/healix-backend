import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import HospitalEntity from './entities/hospital.entity';
import { Repository } from 'typeorm';
import { AppointmentService } from '../appointment/appointment.service';
import { FindNearbyHospitalsDto } from './dto/find-nearby-hospitals.dto';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
    private readonly appointmentService: AppointmentService,
  ) {}

  async findNearbyHospitals(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<FindNearbyHospitalsDto[]> {
    const query = `
      SELECT * FROM (
        SELECT *,
          (6371 * acos(
            cos(radians(@0)) * cos(radians(h.latitude)) * cos(radians(h.longitude) - radians(@1)) +
            sin(radians(@0)) * sin(radians(h.latitude))
          )) AS distance
        FROM hospitals h
      ) AS subquery
      WHERE distance <= @2
      ORDER BY distance
    `;

    const hospitals = await this.hospitalRepository.query(query, [
      latitude,
      longitude,
      radius,
    ]);

    return hospitals.map((hospital) =>
      FindNearbyHospitalsDto.fromHospital(
        {
          latitude,
          longitude,
        },
        hospital,
      ),
    );
  }

  async findHospitalById(id: number) {
    return this.hospitalRepository.findOne({
      where: { id },
    });
  }
}
