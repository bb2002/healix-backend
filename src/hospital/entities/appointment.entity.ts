import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import HospitalEntity from './hospital.entity';

@Entity('appointments')
class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_name' })
  patientName: string;

  @Column({ name: 'date_time' })
  dateTime: Date;

  @ManyToOne(() => HospitalEntity, (hospital) => hospital.appointment)
  hospital: HospitalEntity;
}

export default AppointmentEntity;
