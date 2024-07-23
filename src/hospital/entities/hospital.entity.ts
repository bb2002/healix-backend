import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import AppointmentEntity from './appointment.entity';

@Entity('hospitals')
class HospitalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'institution_name' })
  institutionName: string;

  @Column({ name: 'institution_type' })
  institutionType: string;

  @Column({ name: 'medical_department' })
  medicalDepartment: string;

  @Column({ name: 'medical_department_doctor_count' })
  medicalDepartmentDoctorCount: number;

  @Column({ nullable: true })
  homepage: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  tel: string;

  @Column({
    type: 'float',
  })
  latitude: number;

  @Column({
    type: 'float',
  })
  longitude: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.hospital)
  appointment: AppointmentEntity[];
}

export default HospitalEntity;
