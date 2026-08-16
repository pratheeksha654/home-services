# 🏠 Home Services Platform

A full-stack home services management platform that connects **customers** with **technicians** for on-demand repair, maintenance, and emergency services. Built with a role-based architecture supporting four user types — Customers, Technicians, Coordinators, and Admins.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Roles & Features](#user-roles--features)
- [Database Schema](#database-schema)
- [Scripts](#scripts)

---

## Overview

Home Services Platform streamlines the process of booking, assigning, and tracking home service jobs. Customers can browse services, place bookings (including emergency requests), and track technician arrivals in real-time on a map. Coordinators manage the operations pipeline — reviewing bookings, assigning technicians, and monitoring dashboards. Admins oversee the entire system including user management and coordinator onboarding.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Leaflet / React-Leaflet** | Interactive maps for live tracking |
| **Lucide React & React Icons** | Icon libraries |
| **Supabase JS** | Client-side auth & real-time |

### Backend
| Technology | Purpose |
|---|---|
| **Express 5** | REST API framework |
| **Prisma ORM** | Database access & migrations |
| **PostgreSQL** | Relational database (via Supabase) |
| **Supabase** | Auth, database hosting, real-time |
| **Node.js** | Runtime environment |

---

## Project Structure

```
Home-service/
├── frontend/                  # Next.js 16 application
│   ├── src/
│   │   ├── app/               # App Router pages & layouts
│   │   │   ├── admin/         # Admin dashboard, user & coordinator management
│   │   │   ├── auth/          # Authentication callback
│   │   │   ├── coordinator/   # Coordinator dashboard, assignments, applications
│   │   │   ├── customer/      # Customer homepage, booking, tracking, services
│   │   │   ├── technician/    # Technician dashboard, jobs, schedule, applications
│   │   │   ├── login/         # Login page
│   │   │   ├── onboarding/    # New user onboarding
│   │   │   ├── profile/       # User profile management
│   │   │   ├── about/         # About page
│   │   │   ├── privacy-policy/
│   │   │   └── terms/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── payment/       # Payment summary modals
│   │   │   ├── coordinator/   # Coordinator-specific components
│   │   │   ├── cards/         # Service & info cards
│   │   │   ├── ui/            # Base UI components
│   │   │   ├── auth/          # Auth guard components
│   │   │   ├── navbar/        # Navigation components
│   │   │   ├── Navbar.tsx     # Main navigation bar
│   │   │   ├── Footer.tsx     # Footer
│   │   │   └── TrackingMap.tsx # Real-time map tracking
│   │   ├── context/           # React context providers
│   │   │   └── AuthContext.tsx # Authentication state management
│   │   ├── lib/               # Utility libraries (Supabase client, etc.)
│   │   ├── types/             # TypeScript type definitions
│   │   └── data/              # Static data & constants
│   └── public/                # Static assets
│
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── controllers/       # Route handlers / business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── booking.controller.js
│   │   │   ├── coordinator.controller.js
│   │   │   ├── technician.controller.js
│   │   │   ├── tracking.controller.js
│   │   │   ├── emergency.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── service.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── notification.controller.js
│   │   ├── routes/            # Express route definitions
│   │   ├── middleware/        # Auth & admin middleware
│   │   ├── services/          # Business service layer
│   │   ├── validators/        # Request validation
│   │   ├── utils/             # Helper utilities
│   │   ├── config/            # App configuration
│   │   ├── data/              # Seed data / constants
│   │   └── index.js           # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   └── scripts/               # Utility scripts (e.g., make-admin)
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- A **Supabase** project (for database & authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/pratheeksha654/home-services-backend.git
cd Home-service
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables)).

Run database migrations:

```bash
npx prisma migrate deploy
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api/v1`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/` (see [Environment Variables](#environment-variables)).

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (pooled via PgBouncer) |
| `DIRECT_URL` | Direct PostgreSQL connection string (for migrations) |
| `SUPABASE_URL` | Supabase project reference ID |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public API key |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g., `http://localhost:5000/api/v1`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Full Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public API key |

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Route Prefix | Description |
|---|---|
| `GET /health` | Health check & server status |
| `/auth` | Authentication (signup, login, callback) |
| `/users`, `/user` | User profile management |
| `/services` | Service catalog |
| `/bookings` | Booking CRUD operations |
| `/emergency-requests` | Emergency service requests |
| `/technicians` | Technician management & listings |
| `/coordinator` | Coordinator operations (assignments, dashboard) |
| `/tracking` | Real-time booking/technician tracking |
| `/notifications` | User notifications |
| `/admin` | Admin-only operations (protected by auth + admin middleware) |

---

## User Roles & Features

### 🙋 Customer
- Browse available home services
- Book normal and emergency services
- Track technician location in real-time on an interactive map
- View booking history and status
- Manage profile

### 🔧 Technician
- Apply to become a technician (reviewed by coordinators)
- View and manage active jobs
- Update job status and location sharing
- Manage schedule and availability
- View profile and ratings

### 📋 Coordinator
- Dashboard with summary cards and job overview
- Review and process technician applications
- Assign technicians to bookings
- Handle emergency requests
- Monitor booking pipeline

### 🛡️ Admin
- System-wide dashboard and analytics
- Manage all users
- Onboard and manage coordinators
- Full access to all platform operations

---

## Database Schema

The database is modelled with **Prisma ORM** and hosted on **Supabase (PostgreSQL)**. Key models:

| Model | Description |
|---|---|
| `Profile` | User accounts — stores name, contact, role, and address |
| `Technician` | Technician records — skills, experience, rating, availability |
| `TechnicianApplication` | Applications from users wanting to become technicians |
| `Booking` | Service bookings — customer details, service category, schedule, status |
| `EmergencyRequest` | Urgent service requests with priority levels |
| `BookingTracking` | Real-time tracking data — technician GPS coordinates, ETA, distance |

---

## Scripts

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot-reload (nodemon) |
| `npm start` | Start production server |
| `npm run set-role` | Promote a user to admin (`scripts/make-admin.js`) |
| `npm test` | Run controller unit tests |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

