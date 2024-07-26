import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import Symptom from '../../common/enums/Symptom';
import Gender from '../../common/enums/Gender';

@Entity('examines')
export default class ExamineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'symptom_sites', type: 'nvarchar', length: 'max' })
  symptomSites: Symptom[];

  @Column({ name: 'symptom_comment', type: 'nvarchar', nullable: true })
  symptomComment: string;

  @Column({ name: 'gender', type: 'simple-enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'birth_year', type: 'int' })
  birthYear: number;

  @Column({ name: 'disease_name', type: 'nvarchar', nullable: true })
  diseaseName: string | null;

  @Column({ name: 'disease_solution', type: 'nvarchar', nullable: true })
  diseaseSolution: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  transformSymptomSitesToJSON() {
    if (this.symptomSites) {
      this.symptomSites = JSON.stringify(this.symptomSites) as any;
    }
  }

  @AfterLoad()
  transformSymptomSitesFromJSON() {
    if (this.symptomSites) {
      this.symptomSites = JSON.parse(this.symptomSites as any);
    }
  }
}
