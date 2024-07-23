import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import HospitalEntity from './entities/hospital.entity';

@Module({
  providers: [HospitalService],
  imports: [TypeOrmModule.forFeature([HospitalEntity])],
})
export class HospitalModule {}
