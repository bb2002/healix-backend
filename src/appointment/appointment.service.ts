import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AppointmentEntity from './entities/appointment.entity';
import UserEntity from '../user/entities/user.entity';
import { HospitalService } from 'src/hospital/hospital.service';
import { isSameDay } from 'date-fns';
import { CreateAppointmentRequestDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    @Inject(forwardRef(() => HospitalService))
    private readonly hospitalService: HospitalService,
  ) {}

  async createAppointment(
    hospitalId: number,
    createAppointmentDto: CreateAppointmentRequestDto,
    user: UserEntity,
  ) {
    const hospital = await this.hospitalService.findHospitalById(hospitalId);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    const myCurrentAppointments = (await this.getMyAppointments(user)).filter(
      (value) =>
        value.hospital.id == hospitalId &&
        isSameDay(value.dateTime, createAppointmentDto.dateTime),
    );
    if (myCurrentAppointments && myCurrentAppointments.length != 0) {
      throw new BadRequestException('Can not create appointment in same day.');
    }

    return this.appointmentRepository.save({
      ...createAppointmentDto,
      hospital,
      user,
    });
  }

  async getMyAppointments(user: UserEntity) {
    return this.appointmentRepository.find({
      where: {
        user: user,
      },
      relations: ['hospital'],
    });
  }
}
