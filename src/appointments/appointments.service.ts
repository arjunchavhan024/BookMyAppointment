import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private usersService: UsersService,
    private servicesService: ServicesService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { userId, serviceId, scheduledAt } = createAppointmentDto;

    // Validate user exists
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate service exists
    const service = await this.servicesService.findOne(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Validate scheduled date is in the future
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      throw new BadRequestException('Appointment must be scheduled for a future date');
    }

    // Check for conflicting appointments (same user, overlapping time)
    const existingAppointment = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where('appointment.userId = :userId', { userId })
      .andWhere('appointment.status = :status', { status: AppointmentStatus.BOOKED })
      .andWhere(
        'ABS(EXTRACT(EPOCH FROM (appointment.scheduledAt - :scheduledAt))) < :duration',
        {
          scheduledAt: scheduledDate,
          duration: service.duration * 60, // Convert minutes to seconds
        },
      )
      .getOne();

    if (existingAppointment) {
      throw new ConflictException(
        'You already have an appointment scheduled around this time',
      );
    }

    const appointment = this.appointmentsRepository.create({
      userId,
      serviceId,
      scheduledAt: scheduledDate,
      status: AppointmentStatus.BOOKED,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<Appointment>> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.appointmentsRepository.findAndCount({
      relations: ['user', 'service'],
      order: { scheduledAt: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['user', 'service'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async cancel(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (appointment.status !== AppointmentStatus.BOOKED) {
      throw new BadRequestException('Only booked appointments can be cancelled');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentsRepository.save(appointment);
  }

  async complete(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (appointment.status !== AppointmentStatus.BOOKED) {
      throw new BadRequestException('Only booked appointments can be marked as completed');
    }

    appointment.status = AppointmentStatus.COMPLETED;
    return this.appointmentsRepository.save(appointment);
  }

  // Scheduled task to send reminders (runs every hour)
  @Cron(CronExpression.EVERY_HOUR)
  async sendAppointmentReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const appointments = await this.appointmentsRepository.find({
      where: {
        status: AppointmentStatus.BOOKED,
        scheduledAt: Repository.prototype.moreThan ? Repository.prototype.moreThan(tomorrow) : undefined,
      },
      relations: ['user', 'service'],
    });

    // In a real application, you would send emails/SMS here
    appointments.forEach((appointment) => {
      console.log(
        `Reminder: ${appointment.user.name} has an appointment for ${appointment.service.name} tomorrow at ${appointment.scheduledAt}`,
      );
    });
  }
}