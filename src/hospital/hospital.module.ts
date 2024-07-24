import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import HospitalEntity from './entities/hospital.entity';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { HospitalController } from './hospital.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [HospitalService],
  controllers: [HospitalController],
  imports: [
    TypeOrmModule.forFeature([HospitalEntity]),
    AppointmentModule,
    UserModule,
    JwtModule,
  ],
})
export class HospitalModule {}
