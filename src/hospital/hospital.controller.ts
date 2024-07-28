import {
  BadRequestException,
  Body,
  Controller,
  forwardRef,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import UserEntity from '../user/entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { isBefore } from 'date-fns';
import { AppointmentService } from 'src/appointment/appointment.service';
import {
  CreateAppointmentRequestDto,
  CreateAppointmentResponseDto,
} from '../appointment/dto/create-appointment.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Hospital')
@Controller('hospital')
export class HospitalController {
  constructor(
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
  ) {}

  @ApiOperation({
    summary: '병원 예약 생성',
  })
  @ApiCreatedResponse({
    description: '에약 성공',
    type: CreateAppointmentResponseDto,
  })
  @ApiBadRequestResponse({
    description: '요청이 잘못된 경우',
  })
  @Post(':hospitalId/appointment')
  @UseGuards(AuthGuard)
  async createAppointment(
    @Param('hospitalId') hospitalId: number,
    @Body() createAppointmentDto: CreateAppointmentRequestDto,
    @User() user: UserEntity,
  ) {
    if (isBefore(createAppointmentDto.dateTime, new Date())) {
      throw new BadRequestException(
        'Reservations cannot be made for past dates.',
      );
    }

    const appointment = await this.appointmentService.createAppointment(
      hospitalId,
      createAppointmentDto,
      user,
    );

    return plainToInstance(CreateAppointmentResponseDto, {
      id: appointment.id,
      hospitalName: appointment.hospital.institutionName,
      hospitalAddress: appointment.hospital.address,
      dateTime: createAppointmentDto.dateTime,
    });
  }
}
