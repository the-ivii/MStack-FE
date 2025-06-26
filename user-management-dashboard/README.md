# User Management System

A modern, multi-tenant, role-based User Management System built with React, Node.js, Express, and MongoDB. Features a sophisticated dashboard with analytics, beautiful responsive UI, and enterprise-grade security.

![Dashboard Preview](https://via.placeholder.com/800x400/6B46C1/FFFFFF?text=User+Management+Dashboard)

## Features

### Core Functionality
- **Multi-Tenancy**: Isolated data for different organizations
- **Role-Based Access Control (RBAC)**: Granular permissions system
- **Full CRUD Operations**: Complete management for all entities
- **Real-time Analytics**: Beautiful charts and statistics dashboard
- **Responsive Design**: Works perfectly on all devices

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Frontend and backend route protection
- **RBAC Enforcement**: Middleware-based permission checking

### User Experience
- **Modern UI**: Material-UI with custom purple/green theme
- **Search & Filter**: Advanced data filtering capabilities
- **Pagination**: Efficient data loading and display
- **Mobile-First**: Responsive design with hamburger navigation

## Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Material-UI (MUI)** - Component library
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-management-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend (.env)
   cd backend
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm start

   # Start frontend (from frontend directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Demo Credentials
- **Email**: admin@example.com
- **Password**: password123

## Project Structure

```
user-management-dashboard/
├── backend/
│   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Authentication & RBAC
│   │   ├── config/          # Database & app config
│   │   └── server.js        # Express server
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Main application pages
│   │   │   ├── context/     # React context providers
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── theme.js     # MUI theme configuration
│   │   └── public/          # Static assets
│   └── README.md
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login

### Users
- `GET /api/v1/users` - List users (paginated)
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Tenants
- `GET /api/v1/tenants` - List tenants
- `POST /api/v1/tenants` - Create tenant
- `PUT /api/v1/tenants/:id` - Update tenant
- `DELETE /api/v1/tenants/:id` - Delete tenant

### Organizations
- `GET /api/v1/organizations` - List organizations
- `POST /api/v1/organizations` - Create organization
- `PUT /api/v1/organizations/:id` - Update organization
- `DELETE /api/v1/organizations/:id` - Delete organization

### Roles & Privileges
- `GET /api/v1/roles` - List roles
- `POST /api/v1/roles` - Create role
- `GET /api/v1/privileges` - List privileges
- `POST /api/v1/privileges` - Create privilege

## Key Features Explained

### Multi-Tenancy
The system supports multiple tenants, each with isolated data. Users belong to specific tenants and organizations, ensuring data separation and security.

### Role-Based Access Control
- **Roles**: Define user responsibilities (Admin, Manager, User)
- **Privileges**: Granular permissions (create_user, edit_user, delete_user)
- **Enforcement**: Both frontend UI and backend API protection

### Dashboard Analytics
Real-time statistics and charts showing:
- User distribution and status
- Organization metrics
- System health indicators
- Recent activity feeds

## Customization

### Theme Customization
Modify `frontend/src/theme.js` to change colors, typography, and component styles.

### Adding New Entities
1. Create Mongoose model in `backend/models/`
2. Add API routes in `backend/routes/`
3. Create React page in `frontend/src/pages/`
4. Update navigation in `frontend/src/App.js`

### RBAC Extensions
- Add new privileges in the database
- Update role assignments
- Extend RBAC hooks for new permissions

## Security Considerations

- **JWT Tokens**: Secure, time-limited authentication
- **Password Security**: bcryptjs hashing with salt
- **CORS Configuration**: Proper cross-origin settings
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Secure error responses

## Performance Features

- **Pagination**: Efficient data loading
- **Search Optimization**: Client-side filtering
- **Responsive Images**: Optimized avatar handling
- **Lazy Loading**: Component-based code splitting

## Deployment

### Backend Deployment
```bash
# Production build
npm run build

# Environment variables
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to static hosting (Netlify, Vercel, etc.)
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request





---

**Built  using React, Node.js, and MongoDB**
