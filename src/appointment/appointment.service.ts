import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import HospitalEntity from 'src/hospital/entities/hospital.entity';
import { Repository } from 'typeorm';
import AppointmentEntity from './entities/appointment.entity';
import CreateAppointmentDto from './dto/creat-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {}

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
