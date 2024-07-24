import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppointmentEntity from './entities/appointment.entity';
import { AppointmentService } from './appointment.service';
import HospitalEntity from '../hospital/entities/hospital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity, HospitalEntity])],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
