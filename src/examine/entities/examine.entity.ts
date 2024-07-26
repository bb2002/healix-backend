import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import Symptom from '../../common/enums/Symptom';
import Gender from '../../common/enums/Gender';

@Entity('examines')
export default class ExamineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'symptom_sites', type: 'simple-enum', enum: Symptom })
  symptomSites: Symptom[];

  @Column({ name: 'symptom_comment', type: 'text', nullable: true })
  symptomComment: string;

  @Column({ name: 'gender', type: 'simple-enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'birth_year', type: 'int' })
  birthYear: number;

  @Column({ name: 'disease_name', type: 'string', nullable: true })
  diseaseName: string | null;

  @Column({ name: 'disease_solution', type: 'string', nullable: true })
  diseaseSolution: string | null;
}
