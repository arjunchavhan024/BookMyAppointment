import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
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
export declare class AppointmentsService {
    private appointmentsRepository;
    private usersService;
    private servicesService;
    constructor(appointmentsRepository: Repository<Appointment>, usersService: UsersService, servicesService: ServicesService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findAll(options?: PaginationOptions): Promise<PaginatedResult<Appointment>>;
    findOne(id: string): Promise<Appointment>;
    cancel(id: string): Promise<Appointment>;
    complete(id: string): Promise<Appointment>;
    sendAppointmentReminders(): Promise<void>;
}
