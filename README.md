# Aesthetic Sri Lankan Driving School

A premium, elegant, modern, responsive full-stack Driving School Management Website specifically designed for the Sri Lankan market.

## Project Architecture

This project is built using a modern full-stack architecture separated into distinct layers:

### Frontend
- **Framework**: React.js 18+ via Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS & custom premium CSS classes (`glass-effect`, `premium-gradient`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts (for Admin Dashboard)
- **Internationalization**: i18next (English, Sinhala, Tamil)
- **HTTP Client**: Axios

### Backend API
- **Language**: PHP 8.2+ (Vanilla, No Framework for maximum performance and explicit control)
- **Database**: MySQL 8+ via PDO
- **Architecture**: MVC pattern with RESTful Endpoints
- **Authentication**: Native PHP Sessions (can be upgraded to JWT)

---

## Installation & Setup

### Prerequisites
- [XAMPP](https://www.apachefriends.org/index.html) or [WAMP](https://www.wampserver.com/en/) installed (for Apache & MySQL)
- [Node.js](https://nodejs.org/) installed (for Vite and React)
- [Postman](https://www.postman.com/) (Optional, for testing APIs)

### 1. Database Setup
1. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Create a new database named `driving_school_db`.
3. Import the schema: `database/schema.sql`.
4. Import the seed data: `database/seed.sql`. This will create default courses, vehicles, branches, and an admin user.

**Default Admin Credentials**:
- **Email**: `admin@ceylondrive.lk`
- **Password**: `password123`

### 2. Backend Configuration
The backend resides in the same root directory. Make sure this project folder is inside your `C:\wamp64\www\` or `C:\xampp\htdocs\` folder.
1. The `.htaccess` file automatically routes all `/api/*` traffic to `backend/index.php`.
2. Database configuration is located in `backend/config/Database.php`. Adjust the `username` and `password` if you are not using the default XAMPP/WAMP settings (root / empty password).

### 3. Frontend Setup
1. Open a terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the frontend at `http://localhost:5173`.

---

## API Documentation

A complete Postman collection is included in the `postman/` directory.

### Importing to Postman
1. Open Postman.
2. Click **Import** and select `postman/Driving-School-API.json`.
3. An environment variable named `base_url` is pre-configured to point to `http://localhost/Driving School/api`. (Adjust this if your folder name is different).

### Available Endpoints
- `POST /api/auth/login`: Authenticate as an admin
- `GET /api/auth/me`: Get current authenticated admin
- `GET /api/courses`: Fetch all courses
- `POST /api/courses`: Create a new course (Auth required)
- `GET /api/vehicles`: Fetch all vehicles
- `GET /api/instructors`: Fetch all instructors
- `GET /api/bookings`: Fetch all bookings (Auth required)
- `POST /api/bookings`: Create a new booking (Public)

---

## Deployment Ready Instructions
Before deploying to a live production server:
1. Update `backend/config/Database.php` with production database credentials.
2. Ensure you change the default Admin password via the database or an admin endpoint.
3. Build the frontend for production:
   ```bash
   cd frontend
   npm run build
   ```
4. Copy the contents of the `frontend/dist` folder into your public web directory.

---

## Features Implemented

✅ Complete Database Schema & Seed Data (Sri Lankan Context)
✅ Secure PHP PDO REST API Router
✅ Admin Authentication & Sessions
✅ Complete CRUD Controller architecture for Courses, Vehicles, Instructors, and Bookings
✅ Multi-language React App (English, Sinhala, Tamil)
✅ Premium aesthetic UI with Glassmorphism and Framer Motion
✅ Public Website Layout & Homepage with Animated stats
✅ Admin Dashboard layout with interactive Recharts
✅ Postman API Collection
