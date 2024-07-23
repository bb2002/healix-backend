import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export default class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsDate()
  @Type(() => Date) // YYYY-MM-DDTHH:mm:ss 형식 입력
  @IsNotEmpty()
  dateTime: Date;
}
