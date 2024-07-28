import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class SearchHospitalsRequestDto {
  @ApiProperty({
    description: '위도',
  })
  @IsNumber()
  @Min(33)
  @Max(43)
  latitude: number;

  @ApiProperty({
    description: '경도',
  })
  @IsNumber()
  @Min(124)
  @Max(132)
  longitude: number;

  @ApiProperty({
    description: '진찰 ID',
  })
  @IsNumber()
  examineId: number;
}
