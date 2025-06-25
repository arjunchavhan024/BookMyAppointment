import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @ApiProperty({
    example: AppointmentStatus.CANCELLED,
    enum: AppointmentStatus,
    description: 'New status for the appointment',
  })
  status: AppointmentStatus;
}