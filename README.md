# Service Booking API

A production-style REST API for managing service bookings, built with TypeScript, Node.js, Express, PostgreSQL, and Prisma.

The project demonstrates a layered backend architecture, authentication for web and mobile clients, persistent relational data, request validation, error handling, and automated testing.

The current application models a single Business Admin account responsible for managing bookings. Multi-user administration, role-based access control, and multi-tenant support are outside the current scope.

## Features

### Authentication

- Business Admin registration
- Login and logout
- Access and refresh tokens
- Refresh token rotation
- Password hashing with bcrypt
- Retrieve the currently authenticated Business Admin
- Web authentication using HttpOnly cookies
- Mobile authentication using Bearer tokens
- Protected endpoints through authentication middleware

### Booking Management

- Retrieve paginated bookings
- Retrieve booking details by ID
- Search bookings by:
  - Customer name
  - Mobile number
  - Property address
- Sort bookings by:
  - Preferred date
  - Created date
  - Status
- Update booking status
- Validate pagination, sorting, and status parameters

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JWT
- **Password Hashing:** bcrypt
- **Testing:** Vitest, Supertest

## Architecture

The application separates HTTP handling, business logic, persistence contracts, and database access.

```text
HTTP Request
      │
      ▼
Authentication Middleware
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Data Source
      │
      ▼
PostgreSQL
```

This keeps the core application logic independent from the HTTP and database implementations and makes individual layers easier to test.

## Project Structure

```text
src/
├── app/
├── auth/
│   ├── adapter/
│   ├── data/
│   │   ├── datasource/
│   │   └── repository/
│   ├── domain/
│   ├── integration/
│   ├── presentation/
│   ├── service/
│   ├── testing/
│   └── validation/
│
├── bookings/
│   ├── data/
│   │   ├── datasource/
│   │   └── repository/
│   ├── domain/
│   ├── integration/
│   ├── presentation/
│   ├── service/
│   └── testing/
│
├── common/
├── config/
└── testing/

prisma/
├── migrations/
├── schema.prisma
└── seed.ts
```

## Authentication

The API supports both web and mobile authentication strategies.

The authenticated identity represents the Business Admin responsible for managing bookings. The current application does not implement multiple administrators, roles, or permissions.

### Web

Authentication tokens are stored in HttpOnly cookies so they are not directly accessible through client-side JavaScript.

```text
Cookie: accessToken=...
```

### Mobile

Mobile clients send the access token using the Authorization header.

```text
Authorization: Bearer <access-token>
```

Clients identify their platform using:

```text
X-Client-Platform: web
```

or:

```text
X-Client-Platform: mobile
```

## API

### Authentication

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| `POST` | `/auth/register` | Register the Business Admin |
| `POST` | `/auth/login`    | Authenticate a user         |
| `POST` | `/auth/refresh`  | Refresh authentication      |
| `POST` | `/auth/logout`   | Logout                      |
| `GET`  | `/auth/me`       | Retrieve authenticated user |

### Bookings

| Method  | Endpoint               | Description              |
| ------- | ---------------------- | ------------------------ |
| `GET`   | `/bookings`            | Retrieve bookings        |
| `GET`   | `/bookings/:id`        | Retrieve booking details |
| `PATCH` | `/bookings/:id/status` | Update booking status    |

### Booking Query Parameters

`GET /bookings` supports:

| Parameter   | Default     | Description                                |
| ----------- | ----------- | ------------------------------------------ |
| `page`      | `1`         | Page number                                |
| `pageSize`  | `20`        | Results per page                           |
| `search`    | —           | Search customer, mobile number, or address |
| `sort`      | `createdAt` | `preferredDate`, `createdAt`, or `status`  |
| `direction` | `desc`      | `asc` or `desc`                            |

Example:

```http
GET /bookings?page=1&pageSize=20&search=john&sort=preferredDate&direction=asc
```

## Booking Domain

The booking model separates customers, properties, and bookings rather than duplicating customer information on each booking.

```text
Customer
   │
   │ 1
   ▼
   *
Property
   │
   │ 1
   ▼
   *
Booking
```

A customer can own multiple properties, and a property can have multiple bookings.

A booking belongs to a property. Its customer is resolved through that property.

### Booking Status

```text
PENDING
APPROVED
REJECTED
COMPLETED
```

### Services

```text
HOUSE_CLEANING
DEEP_CLEANING
END_OF_LEASE_CLEANING
```

## Testing

The project includes automated tests across multiple layers:

- Service tests
- Repository tests
- Controller tests
- Middleware tests
- Integration tests
- API integration tests

Integration tests verify multiple application components working together, while API integration tests exercise the application through its HTTP boundary using Supertest.

Run the complete test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage:

```bash
npm run test:coverage
```

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Configure the required environment variables:

```env
NODE_ENV=development
PORT=3000

ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

DATABASE_URL=your-postgresql-connection-string

CLIENT_ORIGIN=http://localhost:5173
```

Apply the database migrations:

```bash
npx prisma migrate deploy
```

Seed development data:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

## Development Commands

Type-check the project:

```bash
npm run typecheck
```

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

Start the compiled application:

```bash
npm start
```

## License

This project is licensed under the MIT License.
