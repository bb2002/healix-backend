import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import HospitalEntity from '../../hospital/entities/hospital.entity';
import UserEntity from 'src/user/entities/user.entity';

@Entity('appointments')
class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'symptom' })
  symptom: string;

  @Column({ name: 'datetime' })
  dateTime: Date;

  @ManyToOne(() => HospitalEntity, (hospital) => hospital.appointment)
  hospital: HospitalEntity;
}

export default AppointmentEntity;
