import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import CreateAppointmentDto from '../appointment/dto/create-appointment.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import UserEntity from 'src/user/entities/user.entity';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @UseGuards(AuthGuard)
  @Post(':hospitalId/appointment')
  createAppointment(
    @Param('hospitalId') hospitalId: number,
    @Body() createAppointmentDto: CreateAppointmentDto,
    @User() user: UserEntity,
  ) {
    return this.hospitalService.createAppointment(
      hospitalId,
      createAppointmentDto,
      user,
    );
  }
}
