# Finance Dashboard Backend API

A RESTful API backend for a finance dashboard application built with Node.js and Express.js. Features JWT-based authentication, role-based access control (RBAC), financial record management, and dashboard analytics — all backed by an in-memory data store seeded on startup.

---

## Setup Instructions

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x

### Installation

```bash
# Clone / navigate to the project directory
cd zorvyn_be_assignment

# Install dependencies
npm install

# Start in development mode (with auto-reload)
npm run dev

# Start in production mode
npm start
```

The server starts on **[http://localhost:1](http://localhost:1)** by default.

---

## Environment Variables

Create a `.env` file in the root (already provided):


| Variable         | Default                      | Description                |
| ---------------- | ---------------------------- | -------------------------- |
| `PORT`           | `3001`                       | Port the server listens on |
| `NODE_ENV`       | `development`                | Environment label          |
| `JWT_SECRET`     | `zorvyn_jwt_secret_key_2024` | Secret used to sign JWTs   |
| `JWT_EXPIRES_IN` | `24h`                        | JWT token expiry duration  |


---

## Test Credentials


| Username        | Password        | Role    | Status   |
| --------------- | --------------- | ------- | -------- |
| `admin`         | `Admin@1234`    | admin   | active   |
| `jane_analyst`  | `Analyst@1234`  | analyst | active   |
| `viewer_bob`    | `Viewer@1234`   | viewer  | active   |
| `inactive_user` | `Inactive@1234` | viewer  | inactive |


---

## Role Permissions


| Resource         | viewer | analyst | admin |
| ---------------- | ------ | ------- | ----- |
| Dashboard (read) | yes    | yes     | yes   |
| Records (read)   | no     | yes     | yes   |
| Records (write)  | no     | no      | yes   |
| Users (read)     | no     | no      | yes   |
| Users (write)    | no     | no      | yes   |


---

## API Endpoints

All protected routes require the `Authorization: Bearer <token>` header.

### Authentication


| Method | Endpoint          | Auth | Description       |
| ------ | ----------------- | ---- | ----------------- |
| POST   | `/api/auth/login` | No   | Login and get JWT |


**POST /api/auth/login** — Request body:

```json
{
  "username": "admin",
  "password": "Admin@1234"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": 1, "username": "admin", "role": "admin", ... }
  }
}
```

---

### Dashboard (all authenticated users)


| Method | Endpoint                            | Auth | Description                         |
| ------ | ----------------------------------- | ---- | ----------------------------------- |
| GET    | `/api/dashboard/summary`            | Yes  | Total income, expenses, net balance |
| GET    | `/api/dashboard/category-breakdown` | Yes  | Income/expense totals per category  |
| GET    | `/api/dashboard/recent`             | Yes  | Recent records (default: 10)        |
| GET    | `/api/dashboard/monthly-trends`     | Yes  | Monthly income/expense trends       |


**Query parameters:**

- `GET /api/dashboard/recent?limit=5` — limit number of results
- `GET /api/dashboard/monthly-trends?year=2024` — filter by year

---

### Financial Records (analyst + admin)


| Method | Endpoint           | Role           | Description               |
| ------ | ------------------ | -------------- | ------------------------- |
| GET    | `/api/records`     | analyst, admin | List records (paginated)  |
| GET    | `/api/records/:id` | analyst, admin | Get a single record by ID |
| POST   | `/api/records`     | admin only     | Create a new record       |
| PUT    | `/api/records/:id` | admin only     | Update an existing record |
| DELETE | `/api/records/:id` | admin only     | Soft-delete a record      |


**GET /api/records — Query parameters:**


| Parameter   | Type   | Description                            |
| ----------- | ------ | -------------------------------------- |
| `startDate` | string | Filter from date (YYYY-MM-DD)          |
| `endDate`   | string | Filter to date (YYYY-MM-DD)            |
| `type`      | string | `income` or `expense`                  |
| `category`  | string | Filter by category name                |
| `page`      | int    | Page number (default: 1)               |
| `pageSize`  | int    | Items per page (default: 10, max: 100) |


**POST /api/records** — Request body:

```json
{
  "amount": 1500.00,
  "type": "income",
  "category": "Freelance",
  "date": "2024-04-01",
  "notes": "Optional note"
}
```

---

### Users (admin only)


| Method | Endpoint         | Description                            |
| ------ | ---------------- | -------------------------------------- |
| GET    | `/api/users`     | List all users (filter by role/status) |
| GET    | `/api/users/:id` | Get a user by ID                       |
| POST   | `/api/users`     | Create a new user                      |
| PUT    | `/api/users/:id` | Update a user                          |
| DELETE | `/api/users/:id` | Deactivate a user (soft delete)        |


**GET /api/users — Query parameters:**


| Parameter | Type   | Description                                  |
| --------- | ------ | -------------------------------------------- |
| `role`    | string | Filter by role: `admin`, `analyst`, `viewer` |
| `status`  | string | Filter by status: `active`, `inactive`       |


**POST /api/users** — Request body:

```json
{
  "username": "new_user",
  "password": "SecurePass@1",
  "role": "analyst",
  "status": "active"
}
```

---

## Response Format

### Success

```json
{
  "success": true,
  "data": { }
}
```

### Paginated list

```json
{
  "success": true,
  "data": [ ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 14,
    "totalPages": 2
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": [
      { "field": "amount", "message": "Amount is required" }
    ]
  }
}
```

---

## Project Structure

```
zorvyn_be_assignment/
├── index.js                  # Entry point — seeds data and starts server
├── .env                      # Environment variables
├── package.json
└── src/
    ├── app.js                # Express app setup and route mounting
    ├── config/
    │   ├── constants.js      # Roles, record types, JWT config, pagination
    │   └── permissions.js    # RBAC permission matrix
    ├── data/
    │   ├── store.js          # In-memory data store
    │   └── seed.js           # Seed users and financial records
    ├── middleware/
    │   ├── auth.js           # JWT authentication middleware
    │   ├── rbac.js           # Role-based access control middleware
    │   └── errorHandler.js   # AppError class and global error handler
    ├── routes/
    │   ├── auth.js           # POST /api/auth/login
    │   ├── users.js          # CRUD /api/users
    │   ├── records.js        # CRUD /api/records
    │   └── dashboard.js      # GET /api/dashboard/*
    ├── services/
    │   ├── userService.js    # User business logic
    │   ├── recordService.js  # Record business logic with pagination
    │   └── dashboardService.js # Aggregation and analytics logic
    └── validators/
        ├── authValidators.js   # Login validation rules
        ├── userValidators.js   # User create/update validation rules
        └── recordValidators.js # Record create/update/list validation rules
```

