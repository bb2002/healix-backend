import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class SearchHospitalsRequestDto {
  @ApiProperty({
    description: '위도',
    example: 37.8813153,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(33)
  @Max(43)
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: '경도',
    example: 127.7299707,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(124)
  @Max(132)
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    description: '진찰 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  examineId: number;
}

export class SearchHospitalsResponseDto {
  @ApiProperty({
    description: '병원 ID (예약에 필요)',
    example: 1,
  })
  @IsNumber()
  hospitalId: number;

  @ApiProperty({
    description: '병원 이름',
    example: '강원대학교 병원',
  })
  @IsString()
  hospitalName: string;

  @ApiProperty({
    description: '병원 주소',
    example: '강원특별자치도 춘천시 공지로 224-4',
  })
  @IsString()
  hospitalAddress: string;

  @ApiProperty({
    description: '이 병원이 적절한 이유',
    example: '이비인후과는 인후통 검사에 적합해요.',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: '그 위치에서 떨어진 거리 (미터 단위)',
    example: 314.1592,
  })
  @IsNumber()
  distance: number;

  @ApiProperty({
    description: '그 병원에 예약 수',
    example: 3,
  })
  @IsNumber()
  waiting: number;
}
