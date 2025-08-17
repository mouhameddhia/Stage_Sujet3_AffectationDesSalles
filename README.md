# Affectation des Salles - Spring Boot Backend

A Spring Boot application for managing room assignments with JWT-based authentication.

## Features

- **User Management**: Complete CRUD operations for users with role-based access
- **Room Management**: Complete CRUD operations for rooms (salles)
- **Assignment Management**: Complete CRUD operations for room assignments (affectations)
- **JWT Authentication**: Secure authentication with JWT tokens
- **Password Security**: BCrypt password hashing
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration

## Project Structure

```
src/main/java/affectationsDesSalles/affectationDesSalles/
├── config/
│   └── SecurityConfig.java              # Spring Security configuration
├── controller/
│   ├── AuthController.java              # Authentication endpoints
│   ├── UserController.java              # User CRUD endpoints
│   ├── SalleController.java             # Room CRUD endpoints
│   └── AffectationController.java       # Assignment CRUD endpoints
├── dto/
│   ├── AuthResponse.java                # Authentication response DTO
│   ├── LoginRequest.java                # Login request DTO
│   └── SignupRequest.java               # Signup request DTO
├── model/
│   ├── User.java                        # User entity
│   ├── Salle.java                       # Room entity
│   └── Affectation.java                 # Assignment entity
├── repository/
│   ├── UserRepository.java              # User data access
│   ├── SalleRepository.java             # Room data access
│   └── AffectationRepository.java       # Assignment data access
├── security/
│   ├── JwtAuthenticationFilter.java     # JWT authentication filter
│   └── JwtUtil.java                     # JWT utility functions
└── service/
    ├── AuthService.java                 # Authentication service interface
    ├── AuthServiceImpl.java             # Authentication service implementation
    ├── UserService.java                 # User service interface
    ├── UserServiceImpl.java             # User service implementation
    ├── SalleService.java                # Room service interface
    ├── SalleServiceImpl.java            # Room service implementation
    ├── AffectationService.java          # Assignment service interface
    └── AffectationServiceImpl.java      # Assignment service implementation
```

## Database Configuration

### PostgreSQL Setup

The application uses PostgreSQL with the following configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/affectation_salles
spring.datasource.username=postgres
spring.datasource.password=0000
```

### Database Tables

#### User Table
```sql
CREATE TABLE "user" (
    "idUser" SERIAL PRIMARY KEY,
    nom VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    "motDePasse" VARCHAR(255),
    role VARCHAR(50)
);
```

#### Salle Table
```sql
CREATE TABLE salle (
    "idSalle" SERIAL PRIMARY KEY,
    nom VARCHAR(255),
    capacite INTEGER,
    type VARCHAR(100)
);
```

#### Affectation Table
```sql
CREATE TABLE affectation (
    idaffectation SERIAL PRIMARY KEY,
    date DATE,
    heuredebut TIME,
    heurefin TIME,
    typeactivite VARCHAR(255),
    idsalle INTEGER REFERENCES salle("idSalle")
);
```

## Authentication System

### JWT Configuration

The application uses JWT tokens for authentication with the following configuration:

```properties
jwt.secret=yourSecretKeyHereMakeItLongAndSecureForProductionUse
jwt.expiration=86400000  # 24 hours in milliseconds
```

### Authentication Endpoints

#### 1. User Registration
- **Endpoint**: `POST /api/auth/signup`
- **Request Body**:
```json
{
    "nom": "John Doe",
    "email": "john.doe@example.com",
    "motDePasse": "password123",
    "role": "user"
}
```
- **Response**:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "nom": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "idUser": 1
}
```

#### 2. User Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
```json
{
    "email": "john.doe@example.com",
    "motDePasse": "password123"
}
```
- **Response**:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "nom": "John Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "idUser": 1
}
```

### Using JWT Tokens

For authenticated requests, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

### Public Endpoints (No Authentication Required)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/test` - Authentication test
- `GET /api/salles/test` - Database connection test

### Protected Endpoints (Authentication Required)

#### User Management
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### Room Management
- `GET /api/salles` - Get all rooms
- `GET /api/salles/{id}` - Get room by ID
- `POST /api/salles` - Create room
- `PUT /api/salles/{id}` - Update room
- `DELETE /api/salles/{id}` - Delete room

#### Assignment Management
- `GET /api/affectations` - Get all assignments
- `GET /api/affectations/{id}` - Get assignment by ID
- `POST /api/affectations` - Create assignment
- `PUT /api/affectations/{id}` - Update assignment
- `DELETE /api/affectations/{id}` - Delete assignment

## Example Requests

### Create a Room
```bash
curl -X POST http://localhost:8080/api/salles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nom": "Salle A101",
    "capacite": 30,
    "type": "salle de cours"
  }'
```

### Create an Assignment
```bash
curl -X POST http://localhost:8080/api/affectations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "date": "2024-01-15",
    "heuredebut": "09:00:00",
    "heurefin": "11:00:00",
    "typeactivite": "Cours",
    "salle": {
      "id": 1
    }
  }'
```

## Security Features

- **Password Hashing**: All passwords are hashed using BCrypt
- **JWT Tokens**: Stateless authentication with JWT tokens
- **CORS Support**: Configured for frontend integration
- **Role-based Access**: Support for "admin" and "user" roles
- **Token Expiration**: JWT tokens expire after 24 hours

## Running the Application

1. **Prerequisites**:
   - Java 17 or higher
   - PostgreSQL database
   - Gradle

2. **Database Setup**:
   - Create a PostgreSQL database named `affectation_salles`
   - Update `application.properties` with your database credentials

3. **Run the Application**:
   ```bash
   ./gradlew bootRun
   ```

4. **Test the Application**:
   - Test database connection: `GET http://localhost:8080/api/salles/test`
   - Test authentication: `GET http://localhost:8080/api/auth/test`

## Frontend Integration

The backend is configured for easy integration with ReactJS frontends:

- CORS is enabled for all origins
- JWT tokens are returned in a frontend-friendly format
- All endpoints return JSON responses
- Error messages are user-friendly

### Frontend Authentication Flow

1. **Registration**: Call `POST /api/auth/signup` with user details
2. **Login**: Call `POST /api/auth/login` with credentials
3. **Store Token**: Save the JWT token in localStorage or state
4. **API Calls**: Include the token in the Authorization header for all subsequent requests

## Development Notes

- The application uses Spring Boot 3.5.3
- JPA/Hibernate for database operations
- Spring Security for authentication and authorization
- JWT for stateless authentication
- BCrypt for password hashing
- PostgreSQL as the primary database