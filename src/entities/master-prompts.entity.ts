import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('master-prompts')
export class MasterPrompts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  prompt: string;
}
