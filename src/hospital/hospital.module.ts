import { forwardRef, Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import HospitalEntity from './entities/hospital.entity';
import { AppointmentModule } from '../appointment/appointment.module';
import { HospitalController } from './hospital.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ExamineModule } from 'src/examine/examine.module';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  providers: [HospitalService],
  imports: [
    TypeOrmModule.forFeature([HospitalEntity]),
    JwtModule,
    UserModule,
    ExamineModule,
    OpenaiModule,
    forwardRef(() => AppointmentModule),
  ],
  controllers: [HospitalController],
  exports: [HospitalService],
})
export class HospitalModule {}
