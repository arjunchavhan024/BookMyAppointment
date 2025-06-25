import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the user booking the appointment',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the service to book',
  })
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @ApiProperty({
    example: '2024-01-20T14:30:00Z',
    description: 'Scheduled date and time for the appointment',
  })
  @IsNotEmpty()
  @IsDateString()
  scheduledAt: string;
}