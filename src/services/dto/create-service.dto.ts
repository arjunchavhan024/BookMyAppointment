import { IsNotEmpty, IsString, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Doctor Consultation',
    description: 'Name of the service',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 30,
    description: 'Duration of the service in minutes',
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number;
}