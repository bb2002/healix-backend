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
}

export class UpdateAppointmentResponseDto {
  @ApiPropertyOptional({
    description: '예약 고유 ID',
    example: 1,
  })
  id: number;

  @ApiPropertyOptional({
    description: '예약된 날짜 ex) YYYY-MM-DDTHH:mm:ss',
    example: '2024-07-28T13:35:00',
  })
  @IsDate()
  @Type(() => Date)
  dateTime: Date;
}
