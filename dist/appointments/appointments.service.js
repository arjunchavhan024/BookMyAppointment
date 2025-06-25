"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const appointment_entity_1 = require("./entities/appointment.entity");
const users_service_1 = require("../users/users.service");
const services_service_1 = require("../services/services.service");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentsRepository, usersService, servicesService) {
        this.appointmentsRepository = appointmentsRepository;
        this.usersService = usersService;
        this.servicesService = servicesService;
    }
    async create(createAppointmentDto) {
        const { userId, serviceId, scheduledAt } = createAppointmentDto;
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const service = await this.servicesService.findOne(serviceId);
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        const scheduledDate = new Date(scheduledAt);
        if (scheduledDate <= new Date()) {
            throw new common_1.BadRequestException('Appointment must be scheduled for a future date');
        }
        const existingAppointment = await this.appointmentsRepository
            .createQueryBuilder('appointment')
            .where('appointment.userId = :userId', { userId })
            .andWhere('appointment.status = :status', { status: appointment_entity_1.AppointmentStatus.BOOKED })
            .andWhere('ABS(EXTRACT(EPOCH FROM (appointment.scheduledAt - :scheduledAt))) < :duration', {
            scheduledAt: scheduledDate,
            duration: service.duration * 60,
        })
            .getOne();
        if (existingAppointment) {
            throw new common_1.ConflictException('You already have an appointment scheduled around this time');
        }
        const appointment = this.appointmentsRepository.create({
            userId,
            serviceId,
            scheduledAt: scheduledDate,
            status: appointment_entity_1.AppointmentStatus.BOOKED,
        });
        return this.appointmentsRepository.save(appointment);
    }
    async findAll(options = {}) {
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
    async findOne(id) {
        const appointment = await this.appointmentsRepository.findOne({
            where: { id },
            relations: ['user', 'service'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async cancel(id) {
        const appointment = await this.findOne(id);
        if (appointment.status !== appointment_entity_1.AppointmentStatus.BOOKED) {
            throw new common_1.BadRequestException('Only booked appointments can be cancelled');
        }
        appointment.status = appointment_entity_1.AppointmentStatus.CANCELLED;
        return this.appointmentsRepository.save(appointment);
    }
    async complete(id) {
        const appointment = await this.findOne(id);
        if (appointment.status !== appointment_entity_1.AppointmentStatus.BOOKED) {
            throw new common_1.BadRequestException('Only booked appointments can be marked as completed');
        }
        appointment.status = appointment_entity_1.AppointmentStatus.COMPLETED;
        return this.appointmentsRepository.save(appointment);
    }
    async sendAppointmentReminders() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        const appointments = await this.appointmentsRepository.find({
            where: {
                status: appointment_entity_1.AppointmentStatus.BOOKED,
                scheduledAt: typeorm_2.Repository.prototype.moreThan ? typeorm_2.Repository.prototype.moreThan(tomorrow) : undefined,
            },
            relations: ['user', 'service'],
        });
        appointments.forEach((appointment) => {
            console.log(`Reminder: ${appointment.user.name} has an appointment for ${appointment.service.name} tomorrow at ${appointment.scheduledAt}`);
        });
    }
};
exports.AppointmentsService = AppointmentsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentsService.prototype, "sendAppointmentReminders", null);
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        services_service_1.ServicesService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map