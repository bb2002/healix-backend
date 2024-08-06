import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { isBefore } from 'date-fns';
import { AppointmentService } from '../appointment/appointment.service';
import {
  CreateAppointmentRequestDto,
  CreateAppointmentResponseDto,
} from '../appointment/dto/create-appointment.dto';
import { plainToInstance } from 'class-transformer';
import {
  UpdateAppointmentRequestDto,
  UpdateAppointmentResponseDto,
} from 'src/appointment/dto/update-appointment.dto';
import { HospitalService } from './hospital.service';
import { ExamineService } from '../examine/examine.service';
import { OpenaiService } from '../openai/openai.service';
import { validate } from 'class-validator';
import haversineDistance from '../common/utils/HaversineDistance';
import { GetMyAppointmentsResponseDto } from '../appointment/dto/get-my-appointments.dto';
import {
  SearchHospitalsRequestDto,
  SearchHospitalsResponseDto,
} from './dto/search-hospitals.dto';
import { SearchHospitalsWithoutExamineRequestDto } from './dto/search-hospitals-without-examine.dto';

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
  @ApiQuery({
    type: SearchHospitalsRequestDto,
  })
  @ApiOkResponse({
    type: SearchHospitalsResponseDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: '주변에 병원이 전혀 없는 경우',
  })
  @Get('/search')
  async searchHospitals(
    @Query()
    payload: {
      examineId: number;
      latitude: number;
      longitude: number;
    },
  ): Promise<SearchHospitalsResponseDto[]> {
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
      // 주변에 병원이 아예 없는 경우
      throw new BadRequestException('There are no hospitals nearby.');
    }

    const sortedHospitals = await this.openAIService.sortRecommendHospitals(
      nearHospitals,
      examine,
    );

    return Promise.all(
      sortedHospitals.map(async ({ hospitalId, reason }) => {
        const searchHospitalsResponseDto = new SearchHospitalsResponseDto();
        const hospital =
          await this.hospitalService.findHospitalById(hospitalId);
        if (!hospital) {
          return null;
        }

        searchHospitalsResponseDto.hospitalId = hospitalId;
        searchHospitalsResponseDto.hospitalAddress = hospital.address;
        searchHospitalsResponseDto.hospitalName = hospital.institutionName;
        searchHospitalsResponseDto.reason = reason;
        searchHospitalsResponseDto.distance = haversineDistance(
          {
            latitude: dto.latitude,
            longitude: dto.longitude,
          },
          {
            latitude: hospital.latitude,
            longitude: hospital.longitude,
          },
        );
        searchHospitalsResponseDto.waiting =
          await this.appointmentService.countAppointment(hospitalId);
        return searchHospitalsResponseDto;
      }),
    );
  }

  @Get('/search/without-examine')
  async searchHospitalsWithoutExamineId(
    @Query()
    payload: {
      latitude: number;
      longitude: number;
    },
  ): Promise<SearchHospitalsResponseDto[]> {
    console.log(payload);
    const dto = plainToInstance(
      SearchHospitalsWithoutExamineRequestDto,
      payload,
    );
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const nearHospitals = await this.hospitalService.findNearbyHospitals(
      dto.latitude,
      dto.longitude,
      1,
    );
    if (!nearHospitals || nearHospitals.length <= 0) {
      // 주변에 병원이 아예 없는 경우
      throw new BadRequestException('There are no hospitals nearby.');
    }

    return Promise.all(
      nearHospitals.map(async (hospital) => {
        const searchHospitalsResponseDto = new SearchHospitalsResponseDto();

        searchHospitalsResponseDto.hospitalId = hospital.id;
        searchHospitalsResponseDto.hospitalAddress = hospital.address;
        searchHospitalsResponseDto.hospitalName = hospital.institutionName;
        searchHospitalsResponseDto.distance = haversineDistance(
          {
            latitude: dto.latitude,
            longitude: dto.longitude,
          },
          {
            latitude: hospital.latitude,
            longitude: hospital.longitude,
          },
        );
        searchHospitalsResponseDto.waiting =
          await this.appointmentService.countAppointment(hospital.id);
        return searchHospitalsResponseDto;
      }),
    );
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
  @Put(':appointmentId/appointment')
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

    return plainToInstance(UpdateAppointmentResponseDto, {
      id: updatedAppointment.id,
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
  @Delete(':appointmentId/appointment')
  @UseGuards(AuthGuard)
  async deleteAppointment(
    @Param('appointmentId') appointmentId: number,
    @User() user: UserEntity,
  ) {
    await this.appointmentService.deleteAppointment(appointmentId, user);
  }

  @ApiOperation({
    summary: '내 예약 목록 조회',
  })
  @Get('/appointment')
  @UseGuards(AuthGuard)
  async getMyAppointments(
    @User() user: UserEntity,
  ): Promise<GetMyAppointmentsResponseDto[]> {
    const myAppointments =
      await this.appointmentService.getMyAppointments(user);

    const appointmentDtos = myAppointments.map((appointment) => ({
      id: appointment.id,
      hospitalName: appointment.hospital.institutionName,
      hospitalAddress: appointment.hospital.address,
      dateTime: appointment.dateTime,
    }));

    return plainToInstance(GetMyAppointmentsResponseDto, appointmentDtos);
  }
}
