import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class SearchHospitalsRequestDto {
  @ApiProperty({
    description: '위도',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(33)
  @Max(43)
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: '경도',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(124)
  @Max(132)
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    description: '진찰 ID',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  examineId: number;
}

export class SearchHospitalsResponseDto {
  @IsNumber()
  hospitalId: number;

  @IsString()
  hospitalName: string;

  @IsString()
  hospitalAddress: string;

  @IsString()
  reason: string;

  @IsNumber()
  distance: number;

  @IsNumber()
  waiting: number;
}
