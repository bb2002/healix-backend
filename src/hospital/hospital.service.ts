import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import HospitalEntity from './entities/hospital.entity';
import { Repository } from 'typeorm';
import { AppointmentService } from '../appointment/appointment.service';

interface LatLon {
  latitude: number;
  longitude: number;
}

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
  ): Promise<HospitalEntity[]> {
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

    return hospitals;
  }

  async findHospitalById(id: number) {
    return this.hospitalRepository.findOne({
      where: { id },
    });
  }

  haversineDistance(pos1: LatLon, pos2: LatLon): number {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;

    const R = 6371000;
    const dLat = toRadians(pos2.latitude - pos1.latitude);
    const dLon = toRadians(pos2.longitude - pos1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(pos1.latitude)) *
        Math.cos(toRadians(pos2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
