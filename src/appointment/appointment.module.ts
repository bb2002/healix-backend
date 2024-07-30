import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppointmentEntity from './entities/appointment.entity';
import { AppointmentService } from './appointment.service';
import { HospitalModule } from '../hospital/hospital.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentEntity]),
    forwardRef(() => HospitalModule),
  ],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
