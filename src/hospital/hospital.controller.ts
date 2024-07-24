import { Body, Controller, Param, Post } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import CreateAppointmentDto from '../appointment/dto/creat-appointment.dto';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  createAppointment(
    @Param('hospitalId') hospitalId: number,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.hospitalService.createAppointment(
      hospitalId,
      createAppointmentDto,
    );
  }
}
