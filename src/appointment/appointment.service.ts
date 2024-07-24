import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import HospitalEntity from '../hospital/entities/hospital.entity';
import { Repository } from 'typeorm';
import AppointmentEntity from './entities/appointment.entity';
import CreateAppointmentDto from './dto/create-appointment.dto';
import UserEntity from '../user/entities/user.entity';

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
    user: UserEntity,
  ) {
    const hospital = await this.hospitalRepository.findOne({
      where: { id: hospitalId },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      hospital,
      userId: user.id,
    });

    return this.appointmentRepository.save(appointment);
  }
}
