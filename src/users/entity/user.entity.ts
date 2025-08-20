import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: string;
}
