import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { HospitalService } from './hospital.service';
import NearbyHospitalDto from './dto/nearby-hospital.dto';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hostpitalService: HospitalService) {}

  @Get('nearby')
  async getNearbyHospitals(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number,
  ): Promise<NearbyHospitalDto[]> {
    if (!latitude || !longitude || !radius) {
      throw new BadRequestException('Invalid query parameters');
    }

    try {
      return await this.hostpitalService.findNearbyHospitals(
        latitude,
        longitude,
        radius,
      );
    } catch (error) {
      console.error('Error during get nearby hospitals:', error);
      throw new InternalServerErrorException('Failed to find nearby hospitals');
    }
  }
}
