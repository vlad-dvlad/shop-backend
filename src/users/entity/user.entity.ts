import { UserRole } from 'src/common/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ length: 255, nullable: true })
  street?: string;

  @Column({ length: 20, nullable: true })
  zipCode?: string;

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
