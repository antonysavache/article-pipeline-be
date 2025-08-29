import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('country-info')
export class CountryInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  key: string;

  @Column({ type: 'text' })
  info: string;
}
