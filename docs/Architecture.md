# Viet Heritage Hub - System Architecture

## Overview

Viet Heritage Hub is built as a full-stack web application following the MVC (Model-View-Controller) pattern on the backend and component-based architecture on the frontend. The system integrates AI capabilities, real-time features, and comprehensive database management.

## System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MySQL)       │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Users         │
│ • Pages         │    │ • Models        │    │ • Products      │
│ • Services      │    │ • Routes        │    │ • Posts         │
│ • Assets        │    │ • Middleware    │    │ • Events        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   AI Services   │
                    │                 │
                    │ • Calligraphy   │
                    │ • Image Restore │
                    │ • Text-to-Speech│
                    └─────────────────┘
```

## Backend Architecture (MVC Pattern)

### Controllers Layer
Handles HTTP requests and responses, orchestrates business logic.

```
controllers/
├── userController.js      # User management
├── mapController.js       # Heritage sites
├── aiController.js        # AI features
├── shopController.js      # Products & orders
├── communityController.js # Posts, groups, events
└── timelineController.js  # Historical periods
```

### Models Layer
Database abstraction, data validation, and business logic.

```
models/
├── userModel.js           # User data operations
├── productModel.js        # Product management
├── postModel.js           # Community posts
├── groupModel.js          # Discussion groups
├── eventModel.js          # Cultural events
├── orderModel.js          # Order transactions
├── historyModel.js        # Historical periods
├── mapModel.js            # Heritage sites
└── aiModel.js             # AI usage tracking
```

### Views Layer
Template rendering for server-side pages (if needed).

```
views/
├── home.ejs
├── map.ejs
├── timeline.ejs
└── admin.ejs
```

### Routes Layer
API endpoint definitions and middleware.

```
routes/
├── userRoutes.js
├── apiRoutes.js
├── adminRoutes.js
└── index.js
```

## Frontend Architecture (Component-Based)

### Component Structure
```
src/
├── components/            # Reusable UI components
│   ├── Header.js
│   ├── Footer.js
│   ├── TimelineComponent.js
│   ├── MapComponent.js
│   ├── AIArtLab.js
│   └── ProductCard.js
├── pages/                 # Page-level components
│   ├── Home.js
│   ├── Timeline.js
│   ├── Map.js
│   ├── Community.js
│   ├── Shop.js
│   └── Profile.js
├── services/              # API service functions
│   ├── api.js
│   ├── auth.js
│   └── ai.js
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── assets/                # Static assets
```

## Database Design

### Core Entities

#### Users
- **Purpose**: User management and authentication
- **Key Fields**: id, name, email, password, role
- **Relationships**: One-to-many with posts, products, orders

#### Historical Periods
- **Purpose**: Timeline data storage
- **Key Fields**: dynasty, start_year, end_year, description
- **Features**: Multimedia support (images, audio)

#### Heritage Sites
- **Purpose**: Geographic cultural sites
- **Key Fields**: name, coordinates, region, type
- **Features**: Multi-language audio guides

#### Products
- **Purpose**: Artisan marketplace
- **Key Fields**: name, price, category, artisan_id
- **Features**: Inventory management, artisan verification

#### Community Features
- **Posts**: User-generated content with verification
- **Groups**: Thematic discussion communities
- **Events**: Cultural event management

### Database Relationships

```
Users (1) ──── (M) Posts
Users (1) ──── (M) Products (Artisan)
Users (1) ──── (M) Orders
Users (1) ──── (M) Events (Organizer)

Posts (M) ──── (1) Groups
Posts (M) ──── (M) Comments

Products (M) ──── (1) Orders
```

## AI Integration Architecture

### AI Services
- **Calligraphy Generation**: Text-to-image AI model
- **Image Restoration**: Computer vision algorithms
- **Text-to-Speech**: Multi-language synthesis
- **Content Moderation**: Automated content filtering

### AI Pipeline
```
User Input → Validation → AI Processing → Result Generation → Storage → Response
```

## Security Architecture

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Session management

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- File upload security

### API Security
- Rate limiting
- CORS configuration
- API key management for third-party services

## Performance Optimization

### Frontend
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Progressive Web App (PWA) features

### Backend
- Database query optimization
- Caching (Redis)
- Load balancing
- CDN integration

### Database
- Indexing strategy
- Query optimization
- Connection pooling
- Read/write separation

## Deployment Architecture

### Development Environment
- Local development servers
- Hot reloading
- Development databases

### Production Environment
- Containerized deployment (Docker)
- Orchestration (Kubernetes)
- Cloud storage (AWS S3)
- CDN (CloudFront)

### CI/CD Pipeline
```
Code Push → Testing → Build → Deploy → Monitor
```

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Microservices architecture potential
- Database sharding strategies

### Performance Monitoring
- Application metrics
- Database performance
- User analytics
- Error tracking

## Technology Stack Details

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **ORM**: Custom SQL queries with connection pooling
- **Authentication**: JWT
- **Validation**: Joi/Custom middleware

### Frontend
- **Framework**: React 18
- **Routing**: React Router
- **State Management**: React Hooks + Context
- **Styling**: CSS Modules + Styled Components
- **Maps**: Leaflet + React-Leaflet
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Application Insights
- **Logging**: Winston

This architecture provides a solid foundation for a scalable, maintainable, and feature-rich cultural heritage platform.
