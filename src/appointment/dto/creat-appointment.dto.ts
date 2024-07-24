import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateAppointmentDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  symptom: string;

  @IsDate()
  @Type(() => Date) // YYYY-MM-DDTHH:mm:ss 형식 입력
  @IsNotEmpty()
  dateTime: Date;
}
