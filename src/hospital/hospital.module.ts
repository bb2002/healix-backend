import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';

@Module({
  providers: [HospitalService]
})
export class HospitalModule {}
