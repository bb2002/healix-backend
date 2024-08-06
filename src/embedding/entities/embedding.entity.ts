import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('embeddings')
export class Embedding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  vector: string;
}
