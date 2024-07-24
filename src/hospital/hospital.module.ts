import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import HospitalEntity from './entities/hospital.entity';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  providers: [HospitalService],
  imports: [TypeOrmModule.forFeature([HospitalEntity]), AppointmentModule],
})
export class HospitalModule {}
