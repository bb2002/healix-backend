import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import AppointmentEntity from './entities/appointment.entity';
import UserEntity from '../user/entities/user.entity';
import { HospitalService } from 'src/hospital/hospital.service';
import { isBefore, endOfDay, isSameDay, startOfDay } from 'date-fns';
import { CreateAppointmentRequestDto } from './dto/create-appointment.dto';
import { UpdateAppointmentRequestDto } from './dto/update-appointment.dto';

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

  async getMyAppointments(user: UserEntity): Promise<AppointmentEntity[]> {
    return this.appointmentRepository.find({
      where: {
        user: user,
      },
      relations: ['hospital'],
    });
  }

  async findAppointmentById(appointmentId: number) {
    return this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['hospital', 'user'],
    });
  }

  async updateAppointment(
    appointmentId: number,
    updateDto: UpdateAppointmentRequestDto,
    user: UserEntity,
  ) {
    const appointment = await this.findAppointmentById(appointmentId);

    // 예약 정보 유효성 검사
    if (!appointment || appointment.user.id !== user.id) {
      throw new NotFoundException('Appointment not found');
    }

    // 날짜/시간 유효성 검사 및 업데이트
    if (updateDto.dateTime) {
      const myCurrentAppointments = (await this.getMyAppointments(user)).filter(
        (value) =>
          value.id !== appointmentId &&
          isSameDay(value.dateTime, updateDto.dateTime),
      );
      if (myCurrentAppointments && myCurrentAppointments.length != 0) {
        throw new BadRequestException(
          'Cannot create multiple appointments on the same day',
        );
      }

      if (isBefore(updateDto.dateTime, new Date())) {
        throw new BadRequestException(
          'Cannot update appointment to a past date.',
        );
      }
      appointment.dateTime = updateDto.dateTime;
    }

    // 증상 정보 업데이트
    if (updateDto.symptom) {
      appointment.symptom = updateDto.symptom;
    }

    return this.appointmentRepository.save(appointment);
  }

  async deleteAppointment(appointmentId: number, user: UserEntity) {
    const appointment = await this.findAppointmentById(appointmentId);

    if (!appointment || appointment.user.id !== user.id) {
      throw new NotFoundException('Appointment not found');
    }

    return this.appointmentRepository.remove(appointment);
  }
  async countAppointment(hospitalId: number) {
    return this.appointmentRepository.count({
      where: {
        hospital: {
          id: hospitalId,
        },
        dateTime: Between(startOfDay(new Date()), endOfDay(new Date())),
      },
    });
  }
}
