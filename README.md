# Doctor Tracker — Healthcare Administration Platform
**Care Guide BD | Technical Recruitment Assignment**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015.1.7-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express%204.21-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%203.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-32%20Passed-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)

---

## 1. Description (Elevator Pitch)

**Doctor Tracker** is a production-conscious healthcare administration SaaS platform engineered for medical supervisors and clinical hospital administrators to seamlessly oversee medical specialists, monitor patient admissions, and track clinical caseload distributions. Built on a resilient, decoupled architecture uniting a Next.js 15 App Router frontend and a standalone Express TypeScript backend backed by MongoDB Atlas, the system delivers real-time clinical analytics, debounced multi-criteria searching, server-side paginated registries, and strict route-level JWT authentication. Doctor Tracker bridges complex healthcare operations with an intuitive, human-centered UI designed to minimize administrative cognitive load while ensuring data integrity and query performance.

---

## 2. Setup Guide

Follow these step-by-step instructions to set up, configure, seed, and run Doctor Tracker locally.

### Prerequisites

* **Node.js**: v18.18+ or v20+ (Node v22 LTS recommended)
* **pnpm**: v9+ (or npm v10+)
* **MongoDB**: MongoDB Atlas connection string (or a local MongoDB instance on port 27017)

---

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd "care guide"

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
pnpm install
cd ..
```

---

### Step 2: Configure Environment Variables

The project includes pre-configured `.env.example` templates for both the frontend and backend.

#### A. Backend Configuration (`backend/.env`)

Create `backend/.env` (or copy from `backend/.env.example`):

```bash
cp backend/.env.example backend/.env
```

Ensure your `backend/.env` contains:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas URI (or mongodb://localhost:27017/doctor_tracker)
MONGODB_URI=mongodb+srv://careguide_admin:<PASSWORD>@careguidedb.d4xjiko.mongodb.net/doctor_tracker?retryWrites=true&w=majority&appName=CareGuideDB

# JWT Authentication Secret
JWT_SECRET=doctor_tracker_super_secure_jwt_secret_key_2026_bd

# CORS Allowed Origin (Frontend URL without trailing slash)
FRONTEND_URL=http://localhost:8080

# Default Seed Administrator
ADMIN_NAME=Dr. Farhana Ahmed
ADMIN_EMAIL=admin@careguide.bd
ADMIN_PASSWORD=DoctorTracker2024!
ADMIN_ROLE=admin
```

> **Note:** If `MONGODB_URI` is left blank, the backend automatically spins up an ephemeral `mongodb-memory-server` engine for zero-configuration testing.

#### B. Frontend Configuration (`.env.local`)

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Ensure your `.env.local` contains:

```env
# Backend REST API Endpoint
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Connect directly to live Express + MongoDB Atlas backend
NEXT_PUBLIC_USE_MOCK=false

# Application Display Title
NEXT_PUBLIC_APP_NAME="Doctor Tracker | Care Guide BD"
```

---

### Step 3: Seed MongoDB Atlas Database

Populate your database with the initial clinical administrator, 8 specialist doctors, and 32 assigned patient records:

```bash
cd backend
pnpm run seed
cd ..
```

Output:
```
✅ MongoDB connected successfully to database: "doctor_tracker"
🌱 Starting database seeding process...
✅ Admin user created: admin@careguide.bd
✅ Seeded 8 doctors into hospital directory
✅ Seeded 32 patients linked to assigned doctors
🎉 Database seeding completed successfully!
```

---

### Step 4: Run the Application

Run both servers in separate terminal windows:

#### Terminal 1 — Backend (Port 5000)
```bash
cd backend
pnpm run dev
# Or run production build: pnpm run build && pnpm run start
```

#### Terminal 2 — Frontend (Port 8080)
```bash
# In the root project directory:
pnpm run dev -- -p 8080
# Or run production build: pnpm run build && pnpm run start -- -p 8080
```

Open your browser at: **[http://localhost:8080](http://localhost:8080)**

---

### Step 5: Sign In

* **Portal URL:** `http://localhost:8080/login`
* **Email:** `admin@careguide.bd`
* **Password:** `DoctorTracker2024!`

---

## 3. System Architecture

Doctor Tracker employs a decoupled client-server architecture with strict separation of concerns, ensuring high maintainability, independent scalability, and security isolation.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CLIENT LAYER (Next.js 15 App Router)                 │
│                                                                        │
│   /login         /dashboard          /doctors          /patients       │
│  [AuthForm]    [Recharts Analytics] [DoctorRegistry]  [PatientRegistry]│
│       │               │                   │                 │          │
│       └───────────────┼───────────────────┴─────────────────┘          │
│                       ▼                                                │
│              TanStack Query v5 (Caching & Invalidation)                │
│                       │                                                │
│              Fetch API Client (HttpOnly Session Credentials)           │
└───────────────────────┼────────────────────────────────────────────────┘
                        │ HTTP / JSON (Port 5000)
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SERVER LAYER (Node.js & Express 4)                   │
│                                                                        │
│   [Helmet Security] ──► [CORS Whitelist] ──► [Rate Limiter (100/15m)]  │
│                                │                                       │
│                        [Auth Middleware]                               │
│                   (JWT Cookie Verification)                            │
│                                │                                       │
│          ┌─────────────────────┼─────────────────────┐                 │
│          ▼                     ▼                     ▼                 │
│  [Doctor Controller]  [Patient Controller]  [Dashboard Controller]     │
│          │                     │                     │                 │
│   [Doctor Service]      [Patient Service]     [Dashboard Service]      │
│  (Zod Validation)      (Zod Validation)     (Mongo Aggregations)       │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │ Mongoose ODM v8
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (MongoDB Atlas)                       │
│                                                                        │
│   Collections:                                                         │
│   ├── users       (Admin accounts, bcrypt salted password hashes)      │
│   ├── doctors     (Specialists, compound text index, status indexes)   │
│   └── patients    (Relational ObjectId refs, triage status, compound)  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Overview

1. **Authentication:** The client sends login credentials to `/api/auth/login`. Upon bcrypt verification, the backend issues an `HttpOnly`, `SameSite=Strict`, `Secure` JWT cookie, mitigating XSS token theft.
2. **State Management & Caching:** The frontend uses **TanStack Query v5**. Server state is indexed by composite query keys (e.g., `["doctors", { page: 1, search: "Cardio" }]`).
3. **Reactive Cache Invalidation:** When a patient or doctor is added, modified, or removed, TanStack Query invalidates both the resource list and the dashboard overview queries in parallel, triggering an instant, flicker-free background refetch.
4. **Relational Aggregation:** The backend executes high-performance MongoDB `$lookup` aggregation pipelines to calculate real-time patient caseloads per doctor without N+1 query penalties.

---

## 4. Technical Decisions

### Decision 1: TanStack Query v5 vs. Redux Toolkit / Context API for Server State

* **Context:** The application requires real-time synchronization of tabular records, multi-parameter search/filtering, pagination, and multi-chart dashboard statistics.
* **Why TanStack Query was chosen:**
  1. **Server State vs. Client State:** Doctor and patient lists represent remote server state, not local UI state. Redux requires substantial boilerplate (reducers, thunks, actions, loading/error flags) to manage data fetching, caching, deduplication, and garbage collection.
  2. **Automatic Request Deduplication & Stale-While-Revalidate:** TanStack Query caches query results for 5 minutes by default (`staleTime: 60s`). When navigating between pages or switching filters, cached results render instantly while an asynchronous revalidation occurs in the background.
  3. **Targeted Invalidation:** Mutations (`useMutation`) execute declarative invalidations:
     ```ts
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["patients"] });
       queryClient.invalidateQueries({ queryKey: ["doctors"] });
       queryClient.invalidateQueries({ queryKey: ["dashboard"] });
     }
     ```
     This guarantees dashboard analytics and doctor caseload badges reflect newly assigned or deleted patients without full page reloads.

---

### Decision 2: Standalone Express + TypeScript Server vs. Next.js API Routes

* **Context:** The project specification on Page 5 allows a standalone server: *"Frontend: Next.js (separate client application), Backend: Node.js, Express (separate standalone server)"*.
* **Why Standalone Express was chosen:**
  1. **Persistent MongoDB Connection Pooling:** Next.js API routes run in serverless or edge runtimes that frequently freeze, terminate, or spin up new lambda instances, causing frequent MongoDB connection churn and reconnect latencies. Standalone Express establishes a persistent connection pool via Mongoose on application bootstrap.
  2. **Enterprise Middleware Pipeline:** Express gives fine-grained control over the security pipeline, including `helmet` header policy, origin-restricted CORS with cookie reflection, IP-based window rate limiting via `express-rate-limit`, and centralized error middleware catching Mongoose CastErrors and MongoServerError 11000 duplicate keys.
  3. **Independent Scalability:** In high-traffic healthcare environments, reporting and dashboard aggregations place heavy computational loads on the backend. Separating the API server allows independent horizontal scaling and separate containerized deployment behind reverse proxies without redeploying the static frontend.

---

## 5. Visual Evidence (UI Screenshots)

> Place your captured high-resolution interface screenshots in `docs/screenshots/` and update references below.

### A. Desktop Views

| Clinical Overview Dashboard | Doctor Management Directory |
| :---: | :---: |
| ![Clinical Overview Dashboard](docs/screenshots/dashboard-desktop.png) | ![Doctor Management Directory](docs/screenshots/doctors-desktop.png) |
| *Live KPI cards, registration trends, caseload bar chart, condition radial distribution* | *Searchable specialist table with specialization badges and assigned caseload counts* |

| Doctor Profile & Patient Caseload | Patient Management Registry |
| :---: | :---: |
| ![Doctor Profile](docs/screenshots/doctor-profile-desktop.png) | ![Patient Management](docs/screenshots/patients-desktop.png) |
| *Detailed doctor profile with direct patient assignment modal and associated caseload* | *Central patient registry with diagnosis, clinical status, attending doctor links, and filters* |

---

### B. Mobile Responsive Views

| Mobile Dashboard | Mobile Navigation & Registry |
| :---: | :---: |
| ![Mobile Dashboard](docs/screenshots/dashboard-mobile.png) | ![Mobile Patient Registry](docs/screenshots/patients-mobile.png) |
| *Single-column responsive KPI stack, touch-optimized charts, and collapsible sidebar* | *Full clinical management functionality formatted for compact touch viewports* |

---

## 6. Testing & Quality Assurance

### Automated Backend Tests (Vitest)

Run the comprehensive integration test suite against the Express API:

```bash
cd backend
pnpm run test
```

**Results:**
```
✓ tests/doctors.test.ts (10 tests)
✓ tests/patients.test.ts (9 tests)
✓ tests/dashboard.test.ts (6 tests)
✓ tests/auth.test.ts (7 tests)

Test Files  4 passed (4)
     Tests  32 passed (32)
  Duration  21.18s
```

### Static Analysis & Production Build

```bash
# Verify ESLint code quality
pnpm run lint
# Output: ✔ No ESLint warnings or errors

# Verify Next.js production build
pnpm run build
# Output: ✓ Compiled successfully, 9/9 pages generated
```

---

## 7. Submission & Credentials Reference

* **Repository:** [https://github.com/careguide-doctor-tracker](https://github.com/careguide-doctor-tracker) *(Replace with your repository URL)*
* **Frontend Port:** `http://localhost:8080`
* **Backend API Port:** `http://localhost:5000/api`
* **Default Admin User:** `admin@careguide.bd`
* **Default Admin Password:** `DoctorTracker2024!`
* **Database Provider:** MongoDB Atlas Free Cluster (`doctor_tracker`)
* **Compliance Audit Report:** [PROJECT_REQUIREMENT_COMPLIANCE_AUDIT.md](./PROJECT_REQUIREMENT_COMPLIANCE_AUDIT.md)
