# SlotWise — Commercial Multi-Tenant Scheduling & Queue SaaS

SlotWise is a production-grade, multi-tenant SaaS platform for appointment scheduling, walk-in queue management, and daily business operations. It is architected for clinics, salons, tutoring centers, maintenance shops, and independent service professionals.

---

## 1. Key Platform Capabilities

- **Strict Multi-Tenancy:** Complete tenant isolation using a shared PostgreSQL database with `tenant_id` invariants and `ThreadLocal` context management.
- **Hardware-Level Double-Booking Prevention:** Multi-layered concurrency control combining PostgreSQL GiST temporal exclusion constraints (`btree_gist`), ACID transaction isolation, and idempotency keys.
- **Walk-in Live Queue Management:** Dynamic token dispatch, ETA calculation, and live staff counter control alongside pre-booked appointments.
- **Modern B2B SaaS UI:** Polished, responsive React 18 + TypeScript + Tailwind CSS application shell with TanStack Query and Lucide icons.
- **Modular Monolith Architecture:** 15 cleanly decoupled bounded context modules with unified DTO communication and centralized exception handling.

---

## 2. Technology Stack

### Backend
- **Java 21 LTS** (Eclipse Adoptium Temurin)
- **Spring Boot 3.3.5**
- **Spring Data JPA & Hibernate 6.5**
- **Spring Security 6** (Stateless JWT architecture)
- **PostgreSQL 16** with `uuid-ossp` and `btree_gist` extensions
- **Flyway 10** database migrations
- **Maven 3.9** build tool
- **Springdoc OpenAPI 3.0 / Swagger UI**

### Frontend
- **React 18.3**
- **TypeScript 5.5**
- **Vite 5.4**
- **Tailwind CSS 3.4**
- **TanStack Query v5**
- **React Router 6**
- **React Hook Form & Zod**
- **Lucide React**

---

## 3. Architecture & Domain Boundaries

The application is built as a modular monolith spanning 15 domains:

1. **Common** (`com.slotwise.common`): Base entities, unified `ApiResponse<T>`, `ApiError`, centralized `GlobalExceptionHandler`, and `TenantContextHolder`.
2. **Configuration** (`com.slotwise.config`): Security filter chains, CORS, OpenAPI 3.0, and WebMvc.
3. **Identity & Authentication** (`com.slotwise.identity`): JWT issuance, BCrypt hashing, RBAC.
4. **Tenants & Accounts** (`com.slotwise.tenant`): Tenant registration, slug resolution, lifecycle management.
5. **Business Management** (`com.slotwise.business`): Profiles, operating hours, holidays, branches.
6. **Staff Management** (`com.slotwise.staff`): Workforce roster, weekly shifts, breaks, time-offs.
7. **Service Catalogue** (`com.slotwise.servicecatalog`): Services, durations, buffer times, pricing.
8. **Availability Engine** (`com.slotwise.scheduling`): Slot calculation algorithms, break pruning.
9. **Appointments** (`com.slotwise.appointment`): Concurrency-safe reservations, status flow.
10. **Queue Management** (`com.slotwise.queue`): Walk-in tokens, ETA engine, counter calls.
11. **Customers** (`com.slotwise.customer`): Customer profiles, booking history, no-show ratios.
12. **Notifications** (`com.slotwise.notification`): Transactional booking emails and reminders.
13. **Analytics** (`com.slotwise.analytics`): Utilization metrics, no-show rates, revenue velocity.
14. **Subscriptions** (`com.slotwise.subscription`): SaaS tier quotas, plan limits, billing integration.
15. **Audit Logging** (`com.slotwise.audit`): Immutable compliance audit records.

Detailed architecture blueprints and diagrams are documented in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 4. Development Environment & Setup Guide

### Windows Prerequisites
- **Java 21 LTS:** Configured at `D:\tools\jdk-21` (or your local JDK 21 installation).
- **Maven 3.9+:** Installed at `D:\tools\apache-maven-3.9.6`.
- **Node.js 20+:** Verified with `node -v` and `npm.cmd -v`.
- **Docker Desktop:** Verified with `docker ps`.

### Quick Setup Steps (Windows CMD / PowerShell)

#### 1. Clone & Configure Environment
```bash
# Clone the repository
git clone <repo-url>
cd SlotWise

# Copy environment template
copy .env.example .env
```

#### 2. Start PostgreSQL Container
```powershell
cd docker
docker compose --env-file ..\.env up -d
# PostgreSQL will be healthy and available on port 5434
```

#### 3. Run Backend Application
```powershell
# Set JAVA_HOME and run backend
$env:JAVA_HOME = "D:\tools\jdk-21"
$env:Path = "D:\tools\jdk-21\bin;" + $env:Path
cd backend
mvn clean test
mvn spring-boot:run
# Backend starts on http://localhost:8080
```

#### 4. Run Frontend Application
```powershell
cd frontend
npm.cmd install
npm.cmd run dev
# Frontend starts on http://localhost:5173
```

---

## 5. Live Verification Endpoints

| Resource | URL | Description |
| :--- | :--- | :--- |
| **Frontend Application** | `http://localhost:5173` | React SaaS dashboard, operations shell & diagnostics |
| **Live Health Check** | `http://localhost:8080/api/v1/health` | Uptime, environment, and PostgreSQL connection probe |
| **OpenAPI / Swagger UI** | `http://localhost:8080/swagger-ui.html`| Interactive REST API documentation and schema explorer |
| **OpenAPI JSON Spec** | `http://localhost:8080/v3/api-docs` | Raw OpenAPI 3.0 specification |
| **Spring Actuator Health**| `http://localhost:8080/actuator/health` | Spring Boot Actuator liveness and readiness probe |

---

## 6. Concurrency Control Strategy

SlotWise guarantees **zero double-booking** through:
- **PostgreSQL GiST Exclusion Constraints:** Uses `tstzrange(start_time, end_time, '[)') WITH &&` on staff appointments to prevent overlapping intervals at the storage engine level.
- **Idempotency Keys:** Protects against duplicate submissions from network retries.
- **Pessimistic Slot Locking:** Acquires short-lived transaction-level locks during reservation.

Complete concurrency specifications and benchmark integration test patterns are in [`docs/BOOKING_CONCURRENCY.md`](docs/BOOKING_CONCURRENCY.md).

---

## 7. Phased Implementation Roadmap

See [`docs/IMPLEMENTATION_ROADMAP.md`](docs/IMPLEMENTATION_ROADMAP.md) for the detailed step-by-step checklist.
- [x] **Phase 1:** Environment, Architecture & Foundational Baseline (COMPLETED & VERIFIED)
- [ ] **Phase 2:** Multi-Tenant Identity, Authentication & Tenant Provisioning
- [ ] **Phase 3:** Business Management, Staff & Service Catalogue
- [ ] **Phase 4:** Availability Engine & Dynamic Slot Generation
- [ ] **Phase 5:** Concurrency-Safe Appointments & Double-Booking Shield
- [ ] **Phase 6:** Walk-in Live Queue Management System
- [ ] **Phase 7:** Public Customer Booking Portal & Discovery
- [ ] **Phase 8:** Transactional Notifications & Event Architecture
- [ ] **Phase 9:** Operational Analytics & Reporting Engine
- [ ] **Phase 10:** SaaS Subscriptions, Audit Logging & Production Readiness
