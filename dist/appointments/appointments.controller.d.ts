import { AppointmentsService, PaginatedResult } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findAll(page?: number, limit?: number): Promise<PaginatedResult<Appointment>>;
    cancel(id: string): Promise<Appointment>;
    complete(id: string): Promise<Appointment>;
}
