import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AppointmentsService, PaginatedResult } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Book a new appointment' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Appointment successfully booked',
    type: Appointment,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or scheduling conflict',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User or service not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Appointment conflict detected',
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of appointments',
  })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<PaginatedResult<Appointment>> {
    return this.appointmentsService.findAll({ page, limit });
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Appointment successfully cancelled',
    type: Appointment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Appointment cannot be cancelled',
  })
  cancel(@Param('id', ParseUUIDPipe) id: string): Promise<Appointment> {
    return this.appointmentsService.cancel(id);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Mark appointment as completed' })
  @ApiParam({
    name: 'id',
    description: 'Appointment ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Appointment successfully marked as completed',
    type: Appointment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Appointment cannot be completed',
  })
  complete(@Param('id', ParseUUIDPipe) id: string): Promise<Appointment> {
    return this.appointmentsService.complete(id);
  }
}