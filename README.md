# FixNest - Home Service Marketplace Frontend

FixNest is a modern, responsive, and real-time Home Service Marketplace web application built with Next.js (App Router), TypeScript, and TailwindCSS. It provides a seamless experience for customers, service technicians, and system coordinators/admins.

---

## 🚀 Key Features

* **Role-Based Workflows**: Tailored user experiences for **Customers**, **Technicians**, and **Coordinators (Admins)**.
* **Customer Hub**: Dynamic category browsing, seamless booking management, standard and emergency request creation, and profile personalization.
* **Technician Onboarding**: Multi-step application system (`TechnicianApplication`) containing professional information forms, qualification reviews, and experience setup.
* **Technician Workspace**: Schedule management, active job viewing, and progress reporting.
* **Coordinator Dashboard**: Full administration panel to manage incoming standard and emergency bookings, review & process technician applications, and manually or automatically assign jobs.
* **Real-time Tracking**: Live Leaflet Maps tracking layout (`BookingTracking`) showing GPS updates, estimated time of arrival (ETA), and progress updates.
* **Premium UI/UX Design**: Stunning visuals utilizing dark modes, subtle micro-animations, custom icons, and fully responsive layouts.

---

## 📂 Project Directory Structure

```text
frontend/
├── public/                # Static assets, images, and brand icons
└── src/
    ├── app/               # Next.js App Router (Pages, Layouts & Routing)
    │   ├── about/         # About Page
    │   ├── auth/          # Authentication pages (login/signup components)
    │   ├── coordinator/   # Coordinator/Admin pages (Dashboard, applications, assignments)
    │   ├── customer/      # Customer-facing portals (Booking, history)
    │   ├── login/         # Primary login view
    │   ├── onboarding/    # Multi-step role selection page
    │   ├── privacy-policy/# Policy page
    │   ├── profile/       # User profile details and settings
    │   ├── technician/    # Technician portals (Schedule, application form)
    │   ├── terms/         # Terms of Service
    │   ├── globals.css    # Core design system configuration and styling
    │   └── layout.tsx     # Global page layout wrapping Context providers
    ├── components/        # Reusable UI Components
    │   ├── ui/            # Form inputs (GlassInput, widgets, overlays)
    │   ├── auth/          # Authentication layouts and guards
    │   ├── cards/         # Booking, technician, and category cards
    │   ├── coordinator/   # Admin dashboard specific widgets
    │   ├── technicianForm/# Wizard steps for technician applications
    │   ├── Footer.tsx     # Global footers
    │   ├── Navbar.tsx     # Role-aware responsive navigation bar
    │   └── TrackingMap.tsx# Real-time Map component using Leaflet 
    ├── context/           # React context state (AuthContext for user state, JWT tokens)
    ├── data/              # Static frontend resources and structural constants
    ├── lib/               # Utility functions, normalization utilities, and API wrappers
    └── types/             # TypeScript type declarations for strict safety
```

---

## 🛠️ Tech Stack

* **Core Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strictly typed schemas)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Maps & Tracking**: [React Leaflet](https://react-leaflet.js.org/)
* **State & Authentication**: Context API (Local storage & HttpOnly Cookies)

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root of the `frontend/` directory and configure the backend connection URL:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## 🚦 Getting Started

Follow these steps to run the frontend locally:

### 1. Install Dependencies
Run the following command in your terminal inside the `frontend` folder:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Open the Application
Navigate to [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 🧪 Build and Production

To build a production bundle and check for syntax or TypeScript errors:

```bash
# Build the project
npm run build

# Start production build server
npm run start
```
