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
    return this.hospitalRepository
      .createQueryBuilder('hospital')
      .where(
        `ST_Distance_Sphere(
          point(hospital.longitude, hospital.latitude),
          point(:longitude, :latitude)
        ) <= :radius`,
        { longitude, latitude, radius: radius * 1000 },
      )
      .getMany();
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
