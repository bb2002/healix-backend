import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import LoginProvider from '../../common/enums/LoginProvider';
import AppointmentEntity from 'src/appointment/entities/appointment.entity';

@Entity('users')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'provider', type: 'simple-enum', enum: LoginProvider })
  provider: LoginProvider;

  @Column({ name: 'provider_id', unique: true })
  providerId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'profile_image_url' })
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.user)
  appointment: AppointmentEntity[];
}
