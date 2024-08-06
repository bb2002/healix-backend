import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class SearchHospitalsWithoutExamineRequestDto {
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
}
