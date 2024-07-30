import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class GetMyAppointmentsResponseDto {
  @ApiProperty({
    description: '예약 고유 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '예약된 병원명',
    example: '강원대학교병원',
  })
  @IsString()
  @IsNotEmpty()
  hospitalName: string;

  @ApiProperty({
    description: '예약된 병원주소',
    example: '강원특별자치도 춘천시 공지로 224-4',
  })
  @IsString()
  @IsNotEmpty()
  hospitalAddress: string;

  @ApiProperty({
    description: '예약된 날짜 ex) YYYY-MM-DDTHH:mm:ss',
    example: '2024-07-28T13:35:00',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateTime: Date;
}
