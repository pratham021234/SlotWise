# SlotWise Implementation Roadmap & Phased Checklist

This document tracks the phased implementation of SlotWise SaaS from initial environment setup through production hardening.

---

## Phase 1: Environment, Architecture & Foundational Baseline (COMPLETED)
- [x] Inspect development environment and verify tools (Java 21, Maven 3.9, Node.js v24, npm 11, Docker Desktop, Git).
- [x] Configure Adoptium Temurin JDK 21 and link `JAVA_HOME` permanently.
- [x] Design 15-module modular monolith architecture with strict domain boundaries.
- [x] Scaffold repository structure (`backend`, `frontend`, `docker`, `docs`).
- [x] Initialize Docker Compose configuration for PostgreSQL 16 with `uuid-ossp` and `btree_gist` extensions.
- [x] Establish environment configuration (`.env.example` and `.env`).
- [x] Implement backend core foundation:
  - [x] Unified `ApiResponse<T>` and `ApiError` standard response models.
  - [x] Base entities (`BaseEntity`, `BaseTenantEntity`) with JPA Auditing and optimistic locking.
  - [x] ThreadLocal multi-tenant primitives (`TenantContext`, `TenantContextHolder`).
  - [x] Centralized `GlobalExceptionHandler` handling business, validation, security, and internal errors.
  - [x] Spring Security 6 stateless JWT configuration and BCrypt password encoder.
  - [x] Flyway migration `V1__initial_schema.sql` (tenants and users tables).
  - [x] OpenAPI 3.0 / Swagger UI documentation integration.
  - [x] Production-grade `GET /api/v1/health` endpoint with live PostgreSQL connectivity check.
- [x] Implement frontend foundation:
  - [x] React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, React Router, Lucide icons.
  - [x] Application shell with responsive Navbar, Sidebar, and active tenant indicators.
  - [x] Interactive Dashboard Overview and live System Health Diagnostics pages.
- [x] Run test suite:
  - [x] Backend JUnit 5 context & MockMvc health tests verified (`mvn clean test` - 2/2 tests pass).
  - [x] Frontend TypeScript compilation and bundle build verified (`npm run build` - 0 errors).
  - [x] End-to-end backend + PostgreSQL + frontend startup and live API integration verified.
- [x] Document system architecture (`docs/ARCHITECTURE.md`) and concurrency strategy (`docs/BOOKING_CONCURRENCY.md`).

---

## Phase 2: Multi-Tenant Identity, Authentication & Account Provisioning
- [ ] JWT token provider (token creation, claims extraction, HMAC-SHA256 signature, expiry enforcement).
- [ ] JWT authentication filter in Spring Security filter chain.
- [ ] User authentication endpoints (`POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`).
- [ ] Tenant self-service registration and onboarding (`POST /api/v1/tenants/register`).
- [ ] Tenant resolution filter (validating subdomain / header / public path against active tenants).
- [ ] Role-Based Access Control (RBAC) security annotations (`@PreAuthorize`).
- [ ] Cross-tenant access denial automated security test suite.
- [ ] Frontend Authentication views (Login, Tenant Registration, User Profile).

---

## Phase 3: Business Management, Staff Workforce & Service Catalogue
- [ ] Business profile configuration API (operating hours, breaks, holidays, timezone, multiple branches).
- [ ] Staff member management (invitations, role assignments, weekly shift schedules, breaks, time-offs).
- [ ] Service catalogue (service categories, durations, buffer times, pricing, staff assignment).
- [ ] Database migrations for business, branch, staff, service, and shift tables.
- [ ] Unit and repository integration tests for business configuration.
- [ ] Frontend Management interfaces (Service Editor, Staff Shift Matrix, Business Settings).

---

## Phase 4: Availability Engine & Dynamic Slot Generation
- [ ] Slot calculation algorithm:
  - [ ] Intersect business operating hours and staff shift schedules.
  - [ ] Subtract staff breaks and scheduled time-off periods.
  - [ ] Prune slots already booked or blocked by buffer times.
- [ ] Slot generation query API (`GET /api/v1/scheduling/slots?serviceId=...&staffId=...&date=...`).
- [ ] Performance caching and query optimization.
- [ ] Slot generation algorithmic test suite across various business and break rules.

---

## Phase 5: Concurrency-Safe Appointments & Double-Booking Shield
- [ ] Appointment state machine (`PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`).
- [ ] Booking creation endpoint (`POST /api/v1/appointments`).
- [ ] PostgreSQL GiST exclusion constraint (`tstzrange` with `&&` overlap check).
- [ ] Idempotency-Key request deduplication filter and cache.
- [ ] Pessimistic locking on staff availability slot.
- [ ] Rescheduling and cancellation workflows with status auditing.
- [ ] High-concurrency integration test: 20 simultaneous threads attempting the exact same slot.
- [ ] Frontend Appointment Calendar, Booking Drawer, and Status Flow views.

---

## Phase 6: Walk-in Live Queue Management System
- [ ] Token generator algorithm (daily sequential token numbering per tenant/service).
- [ ] Queue state machine (`WAITING`, `CALLED`, `SERVING`, `COMPLETED`, `ABSENT`).
- [ ] Dynamic wait-time estimation based on moving average service durations.
- [ ] Staff counter controls: Call Next, Mark Serving, Mark Absent, Re-queue.
- [ ] Live queue dashboard for staff operations.
- [ ] Public customer live queue tracking board with live updates.

---

## Phase 7: Public Customer Booking Portal & Discovery
- [ ] Public business profile discovery page (`/book/{tenantSlug}`).
- [ ] Interactive booking stepper (Service Selection -> Staff Preference -> Slot Picker -> Customer Details -> Confirmation).
- [ ] Booking cancellation & rescheduling self-service links.
- [ ] Public queue token status checker (`/queue/{tenantSlug}/{tokenNumber}`).
- [ ] Mobile-responsive layout optimization.

---

## Phase 8: Transactional Notifications & Event Architecture
- [ ] In-app and asynchronous event bus for lifecycle events (`AppointmentBookedEvent`, `AppointmentCancelledEvent`, `QueueTokenCalledEvent`).
- [ ] Email notification templates (HTML transactional emails for booking confirmations and reminders).
- [ ] Webhook / SMS gateway abstraction layer.
- [ ] Kafka event producer and consumer preparation.

---

## Phase 9: Operational Analytics & Reporting Engine
- [ ] Metrics aggregation service:
  - [ ] Appointment volume trends (daily/weekly/monthly).
  - [ ] Cancellation and no-show percentage metrics.
  - [ ] Staff utilization and productivity metrics.
  - [ ] Average queue wait times and service turnaround durations.
  - [ ] Revenue estimations from completed bookings.
- [ ] Analytics dashboard with charts and date-range filters.

---

## Phase 10: SaaS Subscriptions, Audit Logging & Production Readiness
- [ ] Subscription tier enforcement (Free tier vs Pro tier quotas: max staff, max services, max monthly bookings).
- [ ] Plan limit middleware and feature gating.
- [ ] Immutable audit logging module for sensitive administrative operations.
- [ ] Multi-stage production Dockerfiles for backend and frontend.
- [ ] Nginx reverse proxy configuration with gzip, SSL, and security headers.
- [ ] GitHub Actions CI/CD workflow pipeline for automated testing and container build.

