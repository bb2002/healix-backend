import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}

export default HospitalEntity;
