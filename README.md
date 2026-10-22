# DriveEasy Car Rental System

A complete MERN-stack car rental management web application built with **React (Vite)**, **React Router**, **Context API**, **Node.js (Express CommonJS)**, **Mongoose**, **JWT**, and **MongoDB**.

---

## 📁 Project Structure

```
d:\24it010_awdf\
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # Login & JWT token issuance
│   │   ├── bookingController.js  # Booking creation, retrieval, & status updates
│   │   └── vehicleController.js  # Vehicle fleet queries
│   ├── middleware/
│   │   ├── authGuard.js          # Bearer JWT verification
│   │   ├── errorHandler.js       # Formats 400 errors for validation & duplicates
│   │   └── requestLogger.js      # Global logger: [METHOD] [PATH] [TIMESTAMP]
│   ├── models/
│   │   ├── Booking.js            # Booking schema with ref and enum validation
│   │   ├── Customer.js           # Customer schema with email/license uniqueness
│   │   └── Vehicle.js            # Vehicle schema with type enum & price check
│   ├── routes/
│   │   ├── authRoutes.js         # /api/v1/auth/login
│   │   ├── bookingRoutes.js      # /api/v1/bookings protected endpoints
│   │   └── vehicleRoutes.js      # /api/v1/vehicles public endpoint
│   ├── .env                      # Environment secrets (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example              # Sample environment template
│   ├── .gitignore                # Ignores node_modules and .env
│   ├── package.json              # Backend scripts and dependencies
│   ├── seed.js                   # Populates 1 admin, 2 customers, 8 vehicles
│   └── server.js                 # Express server bootstrap
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── VehicleCard.jsx   # Vehicle display card with action button
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Context provider holding customer & token
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx    # Lazy-loaded admin dashboard
│   │   │   ├── FleetPage.jsx     # Fleet browser, filter, & booking form
│   │   │   ├── LoginPage.jsx     # Customer authentication page
│   │   │   └── MyBookingsPage.jsx# Customer booking list with cancellation
│   │   ├── App.jsx               # Routes setup & Suspense fallback
│   │   ├── main.jsx              # React DOM entry
│   │   ├── Navbar.jsx            # Navigation links and logout handler
│   │   └── ProtectedRoute.jsx    # Guard redirecting unauthenticated users to /
│   ├── index.html
│   ├── package.json
│   └── vite.config.js            # Reverse proxy /api to port 5000
│
└── README.md                     # Setup instructions & API overview
```

---

## 🛠️ Prerequisites & MongoDB Setup

1. **Node.js**: v18+ (tested with v22+)
2. **MongoDB**:
   - Ensure MongoDB is running locally on port `27017` or use MongoDB Atlas.
   - Default connection string: `mongodb://127.0.0.1:27017/driveeasy`
   - To start local MongoDB service on Windows:
     ```powershell
     net start MongoDB
     # or run mongod directly
     mongod --dbpath <data-dir>
     ```

---

## 🚀 Step-by-Step Run Instructions

### 1. Backend Setup

Open a terminal in the root folder:

```bash
cd backend
npm install
```

#### Run Database Seed (Inserts initial data)
```bash
npm run seed
```
This populates:
- **1 Admin**: `admin@driveeasy.com` / `DL-ADMIN-001`
- **2 Customers**:
  - `john@example.com` / `DL-1001`
  - `jane@example.com` / `DL-2002`
- **8 Vehicles** (Hatchbacks, Sedans, SUVs with mixed availability).

#### Start Backend Server
```bash
npm start
```
*Backend runs on `http://localhost:5000` (starts with `node server.js`).*

---

### 2. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` with automated proxy to backend on port 5000.*

---

## 🔑 Authentication & Test Credentials

| Role | Email | Driver's License |
| :--- | :--- | :--- |
| **Admin** | `admin@driveeasy.com` | `DL-ADMIN-001` |
| **Customer** | `john@example.com` | `DL-1001` |
| **Customer** | `jane@example.com` | `DL-2002` |

---

## 📡 API Reference (`/api/v1`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Login with `{ email, licenseNumber }` -> Returns `{ token, customer }` |
| `GET` | `/api/v1/vehicles` | Public | Get all fleet vehicles |
| `POST` | `/api/v1/bookings` | Protected | Create booking with dates & vehicleId -> Marks vehicle unavailable |
| `GET` | `/api/v1/bookings/my` | Protected | Get logged-in customer's bookings (populated) |
| `PATCH` | `/api/v1/bookings/:id/status`| Protected | Update booking status (`completed`/`cancelled` frees vehicle) |

---

## 🛡️ Architecture & Viva Highlights

- **CommonJS & Clean Architecture**: Modular controllers, routes, models, and middleware.
- **Middleware Flow**:
  1. `requestLogger`: Logs `[METHOD] [PATH] [TIMESTAMP]` for every incoming request.
  2. `authGuard`: Extracts and verifies Bearer JWT token, attaching payload to `req.user`.
  3. `errorHandler`: Registered as the very last middleware to format Mongoose validation, CastError, and duplicate key errors into clean JSON errors without leaking stack traces.
- **Client-Side Optimization**:
  - In-memory type filtering (`All`, `Hatchback`, `Sedan`, `SUV`) without unnecessary network calls.
  - Code splitting with `React.lazy()` and `Suspense` for the `AdminPanel`.
