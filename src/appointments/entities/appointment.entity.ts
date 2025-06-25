import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';

export enum AppointmentStatus {
  BOOKED = 'booked',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('appointments')
export class Appointment {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the appointment',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the user who booked the appointment',
  })
  @Column('uuid')
  userId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the service for the appointment',
  })
  @Column('uuid')
  serviceId: string;

  @ApiProperty({
    example: '2024-01-20T14:30:00Z',
    description: 'Scheduled date and time for the appointment',
  })
  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @ApiProperty({
    example: AppointmentStatus.BOOKED,
    enum: AppointmentStatus,
    description: 'Current status of the appointment',
  })
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Timestamp when the appointment was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.appointments, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Service, (service) => service.appointments, { eager: true })
  @JoinColumn({ name: 'serviceId' })
  service: Service;
}