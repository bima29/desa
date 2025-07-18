# Digital Village Backend API

Backend API server for the Digital Village Website built with Node.js, Express, and MySQL.

## Features

- **RESTful API** with Express.js
- **MySQL Database** with connection pooling
- **JWT Authentication** for admin panel
- **Input Validation** with Joi
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Error Handling** with proper HTTP status codes
- **File Upload Support** with Multer
- **Environment Configuration** with dotenv

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Set up MySQL database:
- Create database `desa_digital`
- Import the SQL files from `../supabase/migrations/` directory

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Public Endpoints

#### Desa Settings
- `GET /api/desa/settings` - Get village settings

#### News
- `GET /api/news` - Get paginated news (query: page, limit, status)
- `GET /api/news/:slug` - Get news by slug

#### Gallery
- `GET /api/galleries` - Get gallery items (query: kategori)

#### Events
- `GET /api/events` - Get all events

#### Organization
- `GET /api/organization` - Get organization structure

#### Services
- `GET /api/services` - Get available services
- `POST /api/services/submissions` - Submit service application

### Protected Endpoints (Require Authentication)

#### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create new admin
- `GET /api/auth/verify` - Verify JWT token

#### Admin Management
- `PUT /api/desa/settings` - Update village settings
- `POST /api/news` - Create news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news
- `POST /api/galleries` - Create gallery item
- `PUT /api/galleries/:id` - Update gallery item
- `DELETE /api/galleries/:id` - Delete gallery item
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/organization` - Create organization member
- `PUT /api/organization/:id` - Update organization member
- `DELETE /api/organization/:id` - Delete organization member
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `GET /api/services/submissions` - Get all submissions
- `PUT /api/services/submissions/:id/status` - Update submission status
- `GET /api/statistics` - Get dashboard statistics

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=desa_digital
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## Database Models

### DesaSettings
- Village configuration and branding information

### News
- News articles with slug-based URLs

### Gallery
- Photo gallery with categories

### Events
- Event calendar and scheduling

### Organization
- Village staff and organizational structure

### Service & ServiceSubmission
- Public services and applications

### Admin
- Admin user management with bcrypt password hashing

## Security Features

- **Helmet.js** for security headers
- **CORS** configuration for cross-origin requests
- **Rate limiting** to prevent abuse
- **Input validation** with Joi schemas
- **Password hashing** with bcryptjs
- **JWT authentication** with expiration
- **SQL injection prevention** with parameterized queries

## Development

### Running in Development
```bash
npm run dev
```

### Production Deployment
```bash
npm start
```

## Error Handling

The API includes comprehensive error handling:
- Database connection errors
- Validation errors
- Authentication errors
- Not found errors
- Server errors

All errors return appropriate HTTP status codes and descriptive messages.

## Database Connection

The backend uses MySQL with connection pooling for optimal performance:
- Automatic reconnection
- Connection timeout handling
- Query error handling
- Connection release management

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── desaController.js
│   │   ├── newsController.js
│   │   ├── galleryController.js
│   │   ├── eventController.js
│   │   ├── organizationController.js
│   │   ├── serviceController.js
│   │   └── statisticsController.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── DesaSettings.js
│   │   ├── News.js
│   │   ├── Gallery.js
│   │   ├── Event.js
│   │   ├── Organization.js
│   │   └── Service.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── desa.js
│   │   ├── news.js
│   │   ├── gallery.js
│   │   ├── events.js
│   │   ├── organization.js
│   │   ├── services.js
│   │   └── statistics.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```