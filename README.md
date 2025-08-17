# 🏢 Affectation des Salles - Intelligent Room Assignment System

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-green.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-yellow.svg)](https://jwt.io/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20API-purple.svg)](https://ai.google.dev/)

A comprehensive Spring Boot application for intelligent room assignment management with AI-powered recommendations using Google's Gemini API. This system provides smart suggestions for room bookings, conflict resolution, and automated scheduling optimization.

## 🚀 Features

### Core Functionality
- **User Management**: Complete CRUD operations with role-based access control
- **Room Management**: Comprehensive room (salle) management with hierarchical structure
- **Assignment Management**: Intelligent room assignment with conflict detection
- **JWT Authentication**: Secure authentication with JWT tokens
- **Password Security**: BCrypt password hashing for enhanced security

### 🤖 AI-Powered Smart Recommendations
- **Intelligent Room Suggestions**: AI-driven recommendations using Google Gemini API
- **Conflict Resolution**: Automatic detection and resolution of booking conflicts
- **Smart Scheduling**: Optimal time slot suggestions with detailed reasoning
- **Form Assistance**: AI-powered form filling suggestions and validation
- **Multi-criteria Analysis**: Advanced scoring system based on capacity, location, and availability

### Advanced Features
- **Hierarchical Room Structure**: Support for buildings, floors, and room types
- **Flexible Scheduling**: Configurable time slots with margin handling
- **Real-time Availability**: Live conflict detection and resolution
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Comprehensive API**: RESTful endpoints with detailed documentation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Angular)                │
└─────────────────────┬───────────────────────────────────────┘
                       │
┌─────────────────────▼───────────────────────────────────────┐
│                    Spring Boot Backend                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Controllers   │  │     Services    │  │ Repositories │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                       │
┌─────────────────────▼───────────────────────────────────────┐
│                    Gemini AI API                            │
│              (Smart Recommendations)                        │
└─────────────────────┬───────────────────────────────────────┘
                       │
┌─────────────────────▼───────────────────────────────────────┐
│                    PostgreSQL Database                      │
│              (Hierarchical Room Structure)                  │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/main/java/affectationsDesSalles/affectationDesSalles/
├── config/
│   └── SecurityConfig.java              # Spring Security configuration
├── controller/
│   ├── AuthController.java              # Authentication endpoints
│   ├── UserController.java              # User CRUD endpoints
│   ├── SalleController.java             # Room CRUD endpoints
│   ├── AffectationController.java       # Assignment CRUD endpoints
│   └── SmartRecommendationController.java # AI recommendations
├── dto/
│   ├── AuthResponse.java                # Authentication response DTO
│   ├── LoginRequest.java                # Login request DTO
│   ├── SignupRequest.java               # Signup request DTO
│   ├── SmartRecommendationRequest.java  # AI recommendation request
│   └── SmartRecommendationResponse.java # AI recommendation response
├── model/
│   ├── User.java                        # User entity
│   ├── Salle.java                       # Room entity
│   ├── Affectation.java                 # Assignment entity
│   ├── Bloc.java                        # Building entity
│   └── Etage.java                       # Floor entity
├── repository/
│   ├── UserRepository.java              # User data access
│   ├── SalleRepository.java             # Room data access
│   └── AffectationRepository.java       # Assignment data access
├── security/
│   ├── JwtAuthenticationFilter.java     # JWT authentication filter
│   └── JwtUtil.java                     # JWT utility functions
└── service/
    ├── AuthService.java                 # Authentication service
    ├── UserService.java                 # User service
    ├── SalleService.java                # Room service
    ├── AffectationService.java          # Assignment service
    ├── GeminiApiService.java            # AI service interface
    └── GeminiApiServiceImpl.java        # AI service implementation
```

## 🗄️ Database Schema

### Hierarchical Structure
```sql
-- Buildings (Blocs)
CREATE TABLE bloc (
    id_bloc SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT
);

-- Floors (Étages)
CREATE TABLE etage (
    id_etage SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL,
    id_bloc INTEGER REFERENCES bloc(id_bloc),
    description TEXT
);

-- Rooms (Salles)
CREATE TABLE salle (
    id_salle SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    capacite INTEGER NOT NULL,
    type VARCHAR(100) NOT NULL,
    id_etage INTEGER REFERENCES etage(id_etage),
    accessibilite BOOLEAN DEFAULT false,
    equipements TEXT[]
);

-- Users
CREATE TABLE "user" (
    id_user SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

-- Assignments (Affectations)
CREATE TABLE affectation (
    id_affectation SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    type_activite VARCHAR(255) NOT NULL,
    id_salle INTEGER REFERENCES salle(id_salle),
    id_user INTEGER REFERENCES "user"(id_user),
    description TEXT,
    statut VARCHAR(50) DEFAULT 'active'
);
```

## 🔧 Configuration

### Environment Variables
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/affectation_salles
spring.datasource.username=postgres
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your_secret_key_here_make_it_long_and_secure_for_production_use
jwt.expiration=86400000

# Gemini AI Configuration
gemini.api.key=${GEMINI_API_KEY:your_api_key_here}
gemini.api.base-url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
gemini.api.timeout=30000

# Application Configuration
server.port=8080
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- PostgreSQL 13+
- Gradle 7+
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/affectation-des-salles.git
   cd affectation-des-salles
   ```

2. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb affectation_salles
   
   # Or use the provided SQL scripts
   psql -d affectation_salles -f database/schema.sql
   ```

3. **Configure environment variables**
   ```bash
   # Set your Gemini API key
   export GEMINI_API_KEY=your_api_key_here
   
   # Or add to application.properties
   ```

4. **Run the application**
   ```bash
   ./gradlew bootRun
   ```

5. **Test the application**
   ```bash
   # Test database connection
   curl http://localhost:8080/api/salles/test
   
   # Test AI recommendations
   curl http://localhost:8080/api/smart-recommendations/health
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/test` - Authentication test

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Room Management
- `GET /api/salles` - Get all rooms
- `GET /api/salles/{id}` - Get room by ID
- `POST /api/salles` - Create room
- `PUT /api/salles/{id}` - Update room
- `DELETE /api/salles/{id}` - Delete room

### Assignment Management
- `GET /api/affectations` - Get all assignments
- `GET /api/affectations/{id}` - Get assignment by ID
- `POST /api/affectations` - Create assignment
- `PUT /api/affectations/{id}` - Update assignment
- `DELETE /api/affectations/{id}` - Delete assignment

### 🤖 AI-Powered Smart Recommendations
- `POST /api/smart-recommendations/rooms` - Get intelligent room recommendations
- `POST /api/smart-recommendations/conflict-resolution` - Resolve booking conflicts
- `POST /api/smart-recommendations/form-suggestions` - Get form filling suggestions
- `GET /api/smart-recommendations/health` - Check AI service health
- `GET /api/smart-recommendations/capabilities` - Get system capabilities

## 🧠 AI-Powered Features

### Smart Room Recommendations
The system uses Google's Gemini API to provide intelligent room suggestions based on:

- **Capacity Analysis**: Optimal room size matching
- **Location Preferences**: Building and floor preferences
- **Activity Type**: Room type compatibility
- **Availability**: Real-time conflict detection
- **Accessibility**: Special requirements handling

### Example AI Recommendation Request
```json
{
  "date": "2024-01-15",
  "heureDebut": "09:00",
  "heureFin": "11:00",
  "typeActivite": "Cours magistral",
  "capaciteRequise": 25,
  "capaciteMinAcceptable": 20,
  "capaciteMaxAcceptable": 35,
  "descriptionActivite": "Cours de mathématiques avancées",
  "blocPrefere": "Bloc A",
  "etagePrefere": "2ème étage",
  "typeSallePrefere": "Salle de cours",
  "accessibiliteRequise": false,
  "notesSpeciales": "Projecteur requis",
  "flexibleHoraire": true,
  "margeHoraire": 60,
  "prioriteCapacite": true,
  "prioriteLocalisation": false,
  "prioriteHoraire": false
}
```

### AI Response Structure
```json
{
  "recommendations": [
    {
      "salleId": 1,
      "nomSalle": "Salle A101",
      "score": 95.5,
      "capacite": 30,
      "blocNom": "Bloc A",
      "etageNumero": "2ème étage",
      "availabilityStatus": "available",
      "reasoning": "Optimal capacity match with preferred location",
      "isOptimal": true,
      "whyOptimal": "Perfect capacity match and location preference",
      "advantages": ["Optimal capacity", "Preferred location", "Available"],
      "considerations": ["Requires projector setup"]
    }
  ],
  "aiReasoning": "Analysis based on capacity optimization and location preferences",
  "optimalStrategy": "Prioritize capacity matching with location preferences",
  "hasConflicts": false,
  "alternativeTimeSlots": [],
  "confidenceLevel": "high"
}
```

## 🔒 Security Features

- **JWT Authentication**: Stateless authentication with token expiration
- **Password Hashing**: BCrypt encryption for secure password storage
- **Role-based Access**: Support for admin and user roles
- **CORS Configuration**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive information



## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY build/libs/affectation-des-salles-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Production Configuration
```properties
# Production settings
spring.profiles.active=prod
spring.jpa.hibernate.ddl-auto=validate
logging.level.root=WARN
server.port=8080
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) - The web framework used
- [Google Gemini AI](https://ai.google.dev/) - AI-powered recommendations
- [PostgreSQL](https://www.postgresql.org/) - Database system
- [JWT](https://jwt.io/) - Authentication tokens


---

**Made with ❤️ for intelligent room management**