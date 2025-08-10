# Ticket Management System API

A RESTful API for managing intercity bus ticket bookings, built with Go, Gin Framework, and PostgreSQL.

## Features

- User Authentication and Authorization
- Trip Management
- Seat Management
- Booking System
- Payment Processing
- Admin Dashboard with Statistics

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 12 or higher
- Redis 6 or higher
- Docker (optional)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ticket-management/api_simple
```

2. Install dependencies:

```bash
go mod download
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

4. Create PostgreSQL database:

```sql
CREATE DATABASE ticket_management;
```

5. Run the application:

```bash
go run main.go
```

The server will start at `http://localhost:8080`

## API Endpoints

### Authentication

- POST `/api/v1/auth/register` - Register new user
- POST `/api/v1/auth/login` - Login user

### User

- GET `/api/v1/users/me` - Get user profile
- PUT `/api/v1/users/me` - Update user profile

### Trips

- GET `/api/v1/trips` - List all trips
- GET `/api/v1/trips/:id` - Get trip details
- POST `/api/v1/trips` - Create new trip (Admin only)
- PUT `/api/v1/trips/:id` - Update trip (Admin only)
- DELETE `/api/v1/trips/:id` - Delete trip (Admin only)

### Bookings

- POST `/api/v1/bookings` - Create new booking
- GET `/api/v1/bookings` - List user's bookings
- GET `/api/v1/bookings/:id` - Get booking details
- PUT `/api/v1/bookings/:id/cancel` - Cancel booking

### Admin

- GET `/api/v1/admin/users` - List all users
- GET `/api/v1/admin/bookings` - List all bookings
- GET `/api/v1/admin/statistics` - Get system statistics

## Project Structure

```
.
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middleware/         # Middleware functions
├── models/            # Database models
├── .env               # Environment variables
├── go.mod             # Go modules file
├── go.sum             # Go modules checksum
├── main.go            # Application entry point
└── README.md          # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
