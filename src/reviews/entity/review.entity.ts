import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1000 })
  comment: string;

  @Column({ type: 'int', default: 0 })
  mark: number;
}
