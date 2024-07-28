import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import UserEntity from '../user/entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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
import { UpdateAppointmentRequestDto } from 'src/appointment/dto/update-appointment.dto';

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

  @ApiOperation({
    summary: '병원 예약 수정',
  })
  @ApiOkResponse({
    description: '예약 수정 성공',
    type: CreateAppointmentResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청 데이터',
  })
  @ApiNotFoundResponse({
    description: '해당 예약이 존재하지 않음',
  })
  @Put('appointment/:appointmentId')
  @UseGuards(AuthGuard)
  async updateAppointment(
    @Param('appointmentId') appointmentId: number,
    @Body() dto: UpdateAppointmentRequestDto,
    @User() user: UserEntity,
  ) {
    const updatedAppointment = await this.appointmentService.updateAppointment(
      appointmentId,
      dto,
      user,
    );

    return plainToInstance(CreateAppointmentResponseDto, {
      id: updatedAppointment.id,
      hospitalName: updatedAppointment.hospital.institutionName,
      hospitalAddress: updatedAppointment.hospital.address,
      dateTime: updatedAppointment.dateTime,
    });
  }

  @ApiOperation({
    summary: '병원 예약 삭제',
  })
  @ApiOkResponse({
    description: '예약 삭제 성공',
  })
  @ApiNotFoundResponse({
    description: '해당 예약이 존재하지 않음',
  })
  @Delete('appointment/:appointmentId')
  @UseGuards(AuthGuard)
  async deleteAppointment(
    @Param('appointmentId') appointmentId: number,
    @User() user: UserEntity,
  ) {
    await this.appointmentService.deleteAppointment(appointmentId, user);
    return { message: 'Appointment successfully deleted.' };
  }
}
