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
import { isBefore, isSameDay } from 'date-fns';
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

  async getMyAppointments(user: UserEntity) {
    return this.appointmentRepository.find({
      where: {
        user: user,
      },
      relations: ['hospital'],
    });
  }

  async updateAppointment(
    appointmentId: number,
    updateDto: UpdateAppointmentRequestDto,
    user: UserEntity,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId, user: user },
      relations: ['hospital'],
    });

    // 예약 정보 유효성 검사
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // 병원 정보 유효성 검사
    if (updateDto.hospitalId) {
      const hospital = await this.hospitalService.findHospitalById(
        updateDto.hospitalId,
      );
      if (!hospital) {
        throw new BadRequestException('Hospital not found');
      }
      appointment.hospital = hospital;
    }

    // 날짜/시간 유효성 검사
    if (updateDto.dateTime) {
      const myCurrentAppointments = (await this.getMyAppointments(user)).filter(
        (value) =>
          value.id !== appointmentId &&
          value.hospital.id == updateDto.hospitalId &&
          isSameDay(value.dateTime, updateDto.dateTime),
      );
      if (myCurrentAppointments && myCurrentAppointments.length != 0) {
        throw new BadRequestException(
          'Cannot create multiple appointments on the same day at the same hospital.',
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
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId, user: user },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    await this.appointmentRepository.remove(appointment);
    return { message: 'Appointment successfully canceled.' };
  }
}
