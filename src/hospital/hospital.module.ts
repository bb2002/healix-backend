import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';

@Module({
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}
