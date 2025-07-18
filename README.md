# Digital Village Website

A complete digital village website built with React, TypeScript, Node.js backend, MySQL, and modern animations. This project provides a comprehensive solution for village administration and public services with beautiful UI/UX and full responsiveness.

## Features

### Public Website
- **Homepage**: Village information, statistics, news, and quick services
- **About Village**: Complete village profile, vision, mission, and contact info
- **News System**: News articles with categories and search functionality
- **Photo Gallery**: Image galleries with categories and lightbox view
- **Events/Agenda**: Event calendar with upcoming and past events
- **Organization Structure**: Village staff profiles and organizational chart
- **Public Services**: Online service applications with file upload
- **Contact & Location**: Contact form and location information

### Admin Panel
- **Authentication**: Secure login system with bcrypt password hashing
- **Dashboard**: Beautiful animated dashboard with statistics and overview
- **News Management**: Create, edit, delete news articles
- **Gallery Management**: Upload and manage photos
- **Events Management**: Create and manage events
- **Organization Management**: Manage staff profiles
- **Services Management**: Manage available services
- **Service Submissions**: Handle service applications
- **Document Management**: Upload and manage public documents
- **Village Settings**: Configure village information and branding

### Enhanced Features
- **Full Responsiveness**: Optimized for all screen sizes (mobile, tablet, desktop)
- **Beautiful Animations**: Framer Motion and AOS animations throughout
- **Pagination**: Advanced pagination for news with smooth transitions
- **MySQL Integration**: Full database connectivity with connection pooling
- **Security**: Bcrypt password hashing and JWT-like token authentication
- **Modern UI/UX**: Apple-level design aesthetics with micro-interactions

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Styling**: TailwindCSS
- **Database**: MySQL
- **Database Driver**: mysql2 with connection pooling (backend)
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Animations**: Framer Motion + AOS (Animate On Scroll)
- **Security**: bcryptjs for password hashing, JWT authentication
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Setup Steps

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up MySQL database:
```bash
# Create database and import schema from supabase/migrations/
# Use the latest migration file in phpMyAdmin
```

4. Configure environment variables:
```bash
# Frontend
cp .env.example .env
# Edit .env with your API URL

# Backend
cd backend
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
npm run dev
```

## Database Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:5000/api
```

Backend `.env` file:
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

### Database Setup

1. **Create Database**: Import the latest SQL script from `supabase/migrations/` into phpMyAdmin
2. **Backend Connection**: The backend will automatically connect to the database
3. **Sample Data**: Includes complete sample data for testing

### Admin Access
- **URL**: `/admin/login`
- **Email**: `admin@desa.go.id`
- **Password**: `admin123`

## Database Schema

The application uses the following MySQL tables:

### Core Tables
- `desa_settings`: Village configuration and branding
- `news`: News articles and announcements
- `galleries`: Photo gallery items
- `events`: Event calendar
- `organisasi`: Organization structure
- `layanan`: Available services
- `pengajuan_layanan`: Service applications
- `dokumen`: Public documents
- `admins`: Admin users

### Additional Content Tables
- `menu_navigasi`: Navigation menu configuration
- `slider_beranda`: Homepage slider content
- `statistik_desa`: Village statistics display
- `fasilitas_desa`: Village facilities information
- `pengumuman`: Public announcements
- `kontak_darurat`: Emergency contact numbers
- `testimoni`: User testimonials
- `faq`: Frequently asked questions

All tables include comprehensive fields for complete content management through the admin panel.
## Key Features in Detail

### Responsive Design
- **Mobile-first approach** with breakpoints for all screen sizes
- **Touch-friendly interfaces** with proper spacing and tap targets
- **Flexible grid layouts** that adapt to different screen sizes
- **Optimized images** with proper aspect ratios

### Animations & Interactions
- **Framer Motion**: Smooth page transitions and component animations
- **AOS (Animate On Scroll)**: Beautiful scroll-triggered animations
- **Micro-interactions**: Hover effects, button animations, and loading states
- **Smooth transitions**: All state changes are animated for better UX

### Pagination System
- **Advanced pagination** for news articles with smooth transitions
- **Configurable page sizes** and navigation controls
- **Loading states** during page transitions
- **URL-based pagination** for better SEO and bookmarking

### Security Features
- **Bcrypt password hashing** with configurable salt rounds
- **JWT-like token authentication** with expiration
- **Protected routes** with automatic redirect
- **Input validation** and sanitization
- **File upload restrictions** with type and size validation

### Admin Dashboard
- **Beautiful statistics cards** with animated counters
- **Quick action buttons** for common tasks
- **Recent activity feed** with real-time updates
- **System status monitoring** with health checks
- **Responsive admin interface** optimized for all devices

## File Structure

```
frontend/
├── src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── UI/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       └── SuccessMessage.tsx
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── admin/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── News.tsx
│   ├── NewsDetail.tsx
│   ├── Gallery.tsx
│   ├── Events.tsx
│   ├── Organization.tsx
│   ├── Services.tsx
│   └── Contact.tsx
├── services/
│   └── api.ts
├── components/
│   └── admin/
│       └── ProtectedRoute.tsx
├── utils/
│   ├── auth.ts
│   └── fileUpload.ts
├── config/
│   └── database.ts
├── types/
│   └── index.ts
└── App.tsx

backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── desaController.js
│   │   └── ...
│   ├── models/
│   │   ├── Admin.js
│   │   ├── DesaSettings.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js
│   │   ├── desa.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

The backend provides a complete REST API with the following endpoints:

### Public Endpoints
- `GET /api/desa/settings` - Get village settings
- `GET /api/news` - Get paginated news
- `GET /api/news/:slug` - Get news by slug
- `GET /api/galleries` - Get gallery items
- `GET /api/events` - Get events
- `GET /api/organization` - Get organization structure
- `GET /api/services` - Get available services
- `POST /api/services/submissions` - Submit service application

### Admin Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/statistics` - Get dashboard statistics
- `POST /api/news` - Create news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news
- And more CRUD endpoints for all content types

## Features in Detail

### Public Services
- Online service applications
- File upload support
- Application tracking by number
- Document templates download
- Status updates

### Content Management
- Rich text editor for news with HTML support
- Advanced image upload and management
- Image upload and management
- SEO-friendly URLs with automatic slug generation
- Category-based organization
- Pagination with smooth transitions

### Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Optimized for all screen sizes** from 320px to 4K displays
- **Touch-friendly interfaces** with proper spacing and gestures
- **Fast loading times** with optimized images and code splitting

### Security
- **Input validation** on both client and server side
- **File upload restrictions** with type and size validation
- **SQL injection prevention** using parameterized queries
- **XSS protection** with proper data sanitization
- **Password security** with bcrypt hashing
- **Session management** with token expiration

## Customization

### Village Branding
- Logo and hero image upload
- Custom color scheme
- Village name and slogan
- Complete address and contact info

### Content Types
- **News articles** with rich text content and featured images
- **Photo galleries** with categories and lightbox view
- **Event calendar** with date/time management
- **Service catalog** with application forms
- **Document library** with file management
- **Organization structure** with staff profiles

### User Management
- **Admin authentication** with secure login
- **Role-based access control** (extensible for multiple roles)
- **Profile management** with password change
- **Password security** with bcrypt hashing and strength requirements

## Development

### Running Frontend
```bash
npm run dev
```

### Running Backend
```bash
cd backend
npm run dev
```

### Building for Production
```bash
# Frontend
npm run build

# Backend
cd backend
npm start
```

### Linting
```bash
npm run lint
```

## Sample Data

The project includes comprehensive sample data:
- Village settings and branding
- **News articles** with rich content and images
- **Photo gallery** items with categories
- **Event calendar** entries with dates and locations
- **Organization structure** with staff profiles
- **Service catalog** with requirements and templates
- **Sample admin** credentials for immediate testing
- **Service submissions** with different status examples

## Production Deployment

For production deployment:

1. Build the frontend:
```bash
npm run build
```

2. **Backend Setup**:
   - Deploy backend to your server (PM2, Docker, etc.)
   - Configure environment variables
   - Set up reverse proxy (Nginx)

3. **Database Setup**:
   - Create production MySQL database
   - Import SQL migration files
   - Configure environment variables

4. **Frontend Deployment**:
   - Deploy built files to web server
   - Configure web server (Apache/Nginx)
   - Set up SSL certificate
   - Configure domain and DNS


5. **Security**:
   - Change default admin credentials
   - Set strong JWT secret
   - Configure firewall rules
   - Set up regular database backups

## Performance Optimization

- **Code splitting** with React.lazy for better loading times
- **Image optimization** with proper sizing and compression
- **Database indexing** for faster queries
- **Connection pooling** for efficient database usage
- **API caching** strategies for better performance
- **Caching strategies** for static content
- **Minification** and compression for production builds

## Contributing

This project is designed to be easily customizable for any village:

### Customization Options
- **Design & Branding**: Modify colors, fonts, and layouts
- **Service Types**: Add new service categories and forms
- **Admin Features**: Extend the admin panel with new modules
- **Content Types**: Add new content types and management interfaces
- **Integrations**: Connect with external APIs and services
- **Localization**: Add multi-language support

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Add proper error handling
- Include loading states for all async operations
- Write clean, documented code
- Test on multiple devices and browsers

## License

This project is open source and available under the MIT License.

## Support

For support and questions:
- **Backend API**: Check `backend/README.md` for API documentation
- **Documentation**: Check this README and code comments
- **Issues**: Create an issue in the repository
- **Customization**: The code is well-documented for easy modification
- **Database**: Sample data and schema are provided for reference

## Changelog

### Version 2.1.0
- ✅ Separate backend API server with Node.js + Express
- ✅ JWT authentication system
- ✅ Input validation with Joi
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Clean separation between frontend and backend
- ✅ RESTful API design
- ✅ Improved error handling

### Version 2.0.0
- ✅ Full MySQL database integration
- ✅ Beautiful animations with Framer Motion and AOS
- ✅ Complete responsive design
- ✅ Advanced pagination system
- ✅ Secure admin authentication
- ✅ Enhanced UI/UX with micro-interactions
- ✅ Production-ready security features
- ✅ Comprehensive admin dashboard

### Version 1.0.0
- ✅ Basic website structure
- ✅ Mock data implementation
- ✅ Core functionality
- ✅ Basic styling with Tailwind CSS