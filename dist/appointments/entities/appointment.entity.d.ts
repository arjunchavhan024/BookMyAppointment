import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';
export declare enum AppointmentStatus {
    BOOKED = "booked",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare class Appointment {
    id: string;
    userId: string;
    serviceId: string;
    scheduledAt: Date;
    status: AppointmentStatus;
    createdAt: Date;
    user: User;
    service: Service;
}
