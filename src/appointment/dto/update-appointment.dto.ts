import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentRequestDto {
  @ApiPropertyOptional({
    description: '증상명을 업데이트하려면 이 필드를 사용하세요',
    example: '편두통',
  })
  @IsOptional()
  @IsString()
  symptom?: string;

  @ApiPropertyOptional({
    description:
      '예약날짜와 시간을 업데이트하려면 이 필드를 사용하세요 ex) YYYY-MM-DDTHH:mm:ss',
    example: '2024-07-28T13:35:00',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTime?: Date;

  @ApiPropertyOptional({
    description: '병원 ID를 업데이트하려면 이 필드를 사용하세요',
    example: 1,
  })
  @IsOptional()
  hospitalId?: number;
}
