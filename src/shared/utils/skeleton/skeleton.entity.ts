import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('skeletons')
export class Skeleton {
  @PrimaryColumn({ type: 'varchar' })
  key: string;

  @Column({ type: 'text' })
  skeleton: string;
}
