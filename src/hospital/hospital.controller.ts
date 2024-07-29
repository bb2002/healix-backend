import {
  BadRequestException,
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Query,
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
import { AppointmentService } from '../appointment/appointment.service';
import {
  CreateAppointmentRequestDto,
  CreateAppointmentResponseDto,
} from '../appointment/dto/create-appointment.dto';
import { plainToInstance } from 'class-transformer';
import { SearchHospitalsRequestDto } from './dto/search-hospitals.dto';
import { HospitalService } from './hospital.service';
import { ExamineService } from 'src/examine/examine.service';
import { OpenaiService } from 'src/openai/openai.service';
import { HospitalWithDistanceDto } from 'src/openai/dto/hospital-with-distance.dto';
import { validate } from 'class-validator';

@ApiTags('Hospital')
@Controller('hospital')
export class HospitalController {
  constructor(
    @Inject(forwardRef(() => AppointmentService))
    private readonly appointmentService: AppointmentService,
    private readonly hospitalService: HospitalService,
    private readonly examineService: ExamineService,
    private readonly openAIService: OpenaiService,
  ) {}

  @ApiOperation({
    summary: '주변 병원 찾기',
  })
  @Get('/search')
  async searchHospitals(
    @Query()
    payload: {
      examineId: number;
      latitude: number;
      longitude: number;
    },
  ) {
    const dto = plainToInstance(SearchHospitalsRequestDto, payload);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const examine = await this.examineService.getExamineById(dto.examineId);
    if (!examine) {
      throw new BadRequestException('examineId is not valid.');
    }

    const nearHospitals = await this.hospitalService.findNearbyHospitals(
      dto.latitude,
      dto.longitude,
      1,
    );
    if (!nearHospitals || nearHospitals.length <= 0) {
      throw new BadRequestException('There are no hospitals nearby.');
    }

    return nearHospitals;

    // await this.openAIService.sortRecommendHospitals(
    //   nearHospitals.map((hospital) =>
    //     plainToInstance(HospitalWithDistanceDto, {
    //       hospital,
    //       distance: this.hospitalService.haversineDistance(
    //         { latitude: dto.latitude, longitude: dto.longitude },
    //         { latitude: hospital.latitude, longitude: hospital.longitude },
    //       ),
    //     }),
    //   ),
    //   examine,
    // );
  }

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
