import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import HospitalEntity from './entities/hospital.entity';
import { AppointmentModule } from '../appointment/appointment.module';
import { HospitalController } from './hospital.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [HospitalService],
  imports: [
    TypeOrmModule.forFeature([HospitalEntity]),
    JwtModule,
    UserModule,
    AppointmentModule,
  ],
  controllers: [HospitalController],
})
export class HospitalModule {}
