# Appointment Booking System API

A comprehensive RESTful API for managing appointments, users, and services built with NestJS, TypeScript, and PostgreSQL.

## Features

- **User Management**: Register and list users with email validation
- **Service Management**: Create and manage services with duration
- **Appointment Lifecycle**: Book, cancel, and complete appointments
- **Conflict Detection**: Prevent overlapping appointments for the same user
- **Pagination**: Paginated listing of appointments
- **Validation**: Comprehensive input validation using class-validator
- **Documentation**: Interactive Swagger/OpenAPI documentation
- **Scheduled Tasks**: Automated appointment reminders
- **Unit Tests**: Test coverage for critical functionality

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Task Scheduling**: @nestjs/schedule

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd appointment-booking-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE appointment_booking;
```

### 4. Environment Configuration

Copy the example environment file and configure your database connection:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=appointment_booking
PORT=3000
NODE_ENV=development
```

### 5. Database Migration

The application uses TypeORM with synchronization enabled in development mode. The database schema will be automatically created when you start the application.

For production, you should disable synchronization and use migrations:

```bash
npm run migration:generate -- src/migrations/InitialMigration
npm run migration:run
```

### 6. Start the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`

### 7. API Documentation

Once the application is running, you can access the interactive Swagger documentation at:

```
http://localhost:3000/api/docs
```

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/users` | Register a new user |
| GET    | `/users` | List all users |

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/services` | Create a new service |
| GET    | `/services` | List all services |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/appointments` | Book a new appointment |
| GET    | `/appointments` | List appointments (with pagination) |
| PUT    | `/appointments/:id/cancel` | Cancel an appointment |
| PUT    | `/appointments/:id/complete` | Mark appointment as completed |

## Example API Requests

### Register a User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

### Create a Service

```bash
curl -X POST http://localhost:3000/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Doctor Consultation",
    "duration": 30
  }'
```

### Book an Appointment

```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "serviceId": "123e4567-e89b-12d3-a456-426614174001",
    "scheduledAt": "2024-01-20T14:30:00Z"
  }'
```

### List Appointments with Pagination

```bash
curl -X GET "http://localhost:3000/appointments?page=1&limit=10"
```

### Cancel an Appointment

```bash
curl -X PUT http://localhost:3000/appointments/123e4567-e89b-12d3-a456-426614174002/cancel
```

### Complete an Appointment

```bash
curl -X PUT http://localhost:3000/appointments/123e4567-e89b-12d3-a456-426614174002/complete
```

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Postman Collection

You can import the following requests into Postman for testing:

### Environment Variables
- `baseUrl`: `http://localhost:3000`

### Collection Structure

1. **Users**
   - POST Register User
   - GET List Users

2. **Services**
   - POST Create Service
   - GET List Services

3. **Appointments**
   - POST Book Appointment
   - GET List Appointments
   - PUT Cancel Appointment
   - PUT Complete Appointment

## Advanced Features

### Appointment Reminders

The system includes automated appointment reminders that run every hour. These check for appointments scheduled for the next day and log reminder messages. In a production environment, you would integrate with email/SMS services.

### Conflict Detection

The system prevents users from booking overlapping appointments by checking for existing appointments within the service duration window.

### Pagination

The appointments listing endpoint supports pagination with `page` and `limit` query parameters:

```bash
GET /appointments?page=2&limit=5
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR(255))
- `email` (VARCHAR(255), Unique)
- `createdAt` (TIMESTAMP)

### Services Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR(255))
- `duration` (INTEGER, minutes)
- `createdAt` (TIMESTAMP)

### Appointments Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `serviceId` (UUID, Foreign Key)
- `scheduledAt` (TIMESTAMP)
- `status` (ENUM: booked, cancelled, completed)
- `createdAt` (TIMESTAMP)

## Error Handling

The API provides comprehensive error handling with appropriate HTTP status codes:

- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `409 Conflict`: Email already exists or appointment conflict
- `422 Unprocessable Entity`: Validation errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Thank You !