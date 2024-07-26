import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import UserEntity from '../../user/entities/user.entity';
import Symptom from '../../common/enums/Symptom';
import Gender from '../../common/enums/Gender';

@Entity('examines')
export default class ExamineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'symptoms', type: 'simple-enum', enum: Symptom })
  symptoms: Symptom[];

  @Column({ name: 'detailed_symptom', type: 'text', nullable: true })
  detailedSymptom: string;

  @Column({ name: 'gender', type: 'simple-enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'birth_year', type: 'int' })
  birthYear: number;

  @ManyToOne(() => UserEntity, (user) => user.examines)
  @JoinColumn({ name: 'user' })
  user: UserEntity;
}
