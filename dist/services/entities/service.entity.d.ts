import { Appointment } from '../../appointments/entities/appointment.entity';
export declare class Service {
    id: string;
    name: string;
    duration: number;
    createdAt: Date;
    appointments: Appointment[];
}
