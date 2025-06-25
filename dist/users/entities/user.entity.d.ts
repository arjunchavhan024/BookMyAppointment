import { Appointment } from '../../appointments/entities/appointment.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    appointments: Appointment[];
}
