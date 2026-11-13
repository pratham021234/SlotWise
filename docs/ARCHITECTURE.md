# SlotWise Architecture Documentation

## 1. System Overview

SlotWise is a production-grade, multi-tenant SaaS platform built for appointment scheduling, walk-in queue management, and daily service business operations. Designed for high concurrency and strict tenant isolation, SlotWise delivers commercial-grade reliability for healthcare clinics, beauty salons, tutoring centers, and maintenance providers.

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|   React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query + shadcn |
+-------------------------------------------------------------------------+
                                    | HTTPS / REST JSON
                                    v
+-------------------------------------------------------------------------+
|                             API GATEWAY                                 |
|         Nginx / Reverse Proxy / SSL Termination / Rate Limiting         |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                  SLOTWISE MODULAR MONOLITH (Java 21)                    |
|                      Spring Boot 3.3.x / Tomcat                         |
|                                                                         |
|  +----------------+  +----------------+  +---------------------------+  |
|  | Common         |  | Configuration  |  | Identity & Authentication |  |
|  +----------------+  +----------------+  +---------------------------+  |
|  | Tenants        |  | Business       |  | Staff Management          |  |
|  +----------------+  +----------------+  +---------------------------+  |
|  | Service Cat.   |  | Scheduling Eng |  | Appointments (Concurrency)|  |
|  +----------------+  +----------------+  +---------------------------+  |
|  | Queue Engine   |  | Customers      |  | Notifications             |  |
|  +----------------+  +----------------+  +---------------------------+  |
|  | Analytics      |  | Subscriptions  |  | Audit Logging             |  |
|  +----------------+  +----------------+  +---------------------------+  |
|                                                                         |
|         Tenant Context Holder (ThreadLocal) & Security Filter Chain     |
+-------------------------------------------------------------------------+
             |                                             |
             v                                             v
+-----------------------------+               +---------------------------+
|    POSTGRESQL 16 CLUSTER    |               |    REDIS (Future Phase)   |
|  - Shared DB / Tenant ID    |               |  - Distributed locks      |
|  - GiST Exclusion Contraint |               |  - Cache & token state    |
|  - Flyway Versioned Schema  |               +---------------------------+
+-----------------------------+
```

---

## 2. Modular Monolith Domain Boundaries

SlotWise is organized into 15 domain modules. Each module maintains strict encapsulation, clean separation of concerns, and communicates through defined service contracts and DTOs.

| Module | Package | Responsibilities |
| :--- | :--- | :--- |
| **1. Common** | `com.slotwise.common` | Base entities, unified `ApiResponse<T>`, `ApiError`, centralized `GlobalExceptionHandler`, and `TenantContextHolder`. |
| **2. Configuration** | `com.slotwise.config` | Spring Security 6 stateless filter chain, CORS mapping, OpenAPI 3.0 documentation, and WebMvc config. |
| **3. Identity & Auth** | `com.slotwise.identity` | JWT token issuing & validation, password hashing (BCrypt), user credential verification, and RBAC. |
| **4. Tenants & Accounts** | `com.slotwise.tenant` | Tenant onboarding, slug/domain resolution, status lifecycle (ACTIVE, SUSPENDED, TRIAL), and isolation guards. |
| **5. Business Management**| `com.slotwise.business`| Business profile, operating hours, branch locations, holidays, and closure periods. |
| **6. Staff Management** | `com.slotwise.staff` | Staff invitations, role assignments, weekly shift schedules, breaks, and time-off tracking. |
| **7. Service Catalogue**| `com.slotwise.servicecatalog`| Service offerings, durations, buffer times (prep/cleanup), pricing, and staff-service capabilities. |
| **8. Scheduling Engine**| `com.slotwise.scheduling`| Real-time availability calculation, working-hours intersection, break exclusion, and slot generator. |
| **9. Appointments** | `com.slotwise.appointment` | Concurrency-safe booking, reservation confirmation, cancellation, rescheduling, and status transitions. |
| **10. Queue Management**| `com.slotwise.queue` | Walk-in token generator, FIFO/priority queue dispatch, dynamic ETA estimation, and counter calling. |
| **11. Customers** | `com.slotwise.customer` | Customer identity records, booking histories, no-show tracking, and public discovery profile. |
| **12. Notifications** | `com.slotwise.notification`| Transactional emails, booking confirmations, cancellation notices, and reminder dispatch. |
| **13. Analytics** | `com.slotwise.analytics` | Business intelligence: appointment volume, cancellation rates, no-show ratios, staff utilization, and revenue. |
| **14. Subscriptions** | `com.slotwise.subscription`| Multi-tier SaaS plans (Free, Pro, Enterprise), quota enforcement, and billing engine hooks. |
| **15. Audit Logging** | `com.slotwise.audit` | Immutable audit trails recording user, action, tenant context, timestamp, and metadata for compliance. |

---

## 3. Multi-Tenancy Architecture

SlotWise adopts a **Shared Database with Discriminator (`tenant_id`)** pattern, optimized with PostgreSQL row-level indexing and declarative security enforcement.

### 3.1 Security Principles
1. **Never trust client-supplied `tenant_id`:** Request bodies from clients cannot specify or overwrite the tenant identifier.
2. **Context Resolution:** The tenant context is resolved server-side:
   - For authenticated users: Extracted directly from validated JWT claims (`tenant_id`).
   - For public customer endpoints: Extracted from validated public slug parameter (`/api/v1/public/{tenantSlug}/...`) and verified against the database.
3. **ThreadLocal Context Isolation:** The `TenantContextHolder` binds tenant data to the executing request thread.
4. **Base Tenant Entity:** All tenant-owned tables inherit from `BaseTenantEntity`, enforcing a non-nullable, non-updatable `tenant_id` column:
   ```java
   @MappedSuperclass
   public abstract class BaseTenantEntity extends BaseEntity {
       @Column(name = "tenant_id", nullable = false, updatable = false)
       private UUID tenantId;
   }
   ```
5. **Data Layer Enforcement:** All repository queries for tenant data enforce `WHERE tenant_id = :tenantId`. Cross-tenant data leakage is prevented at both service and repository boundaries.

---

## 4. Concurrency & Concurrency Control

Appointment scheduling requires strict concurrency guarantees: **two simultaneous booking attempts for the same staff member in overlapping time windows must never both succeed**.

SlotWise employs a defense-in-depth concurrency strategy:
1. **Database-level GiST Temporal Exclusion Constraints:** Prevents overlapping timestamp ranges (`tstzrange`) for a given staff member directly in PostgreSQL storage.
2. **ACID Transaction Isolation:** Serializable / Read Committed with explicit pessimistic row locks on staff availability slots.
3. **Idempotency Keys:** Every booking request carries a unique `Idempotency-Key` header to eliminate duplicate submissions from client retries.
4. **Detailed Reference:** Full concurrency architecture and benchmarks are documented in [BOOKING_CONCURRENCY.md](file:///F:/Java_projects/SlotWise/docs/BOOKING_CONCURRENCY.md).

---

## 5. Security & RBAC Model

SlotWise implements role-based access control with 5 distinct personas:

| Role | Scope | Permissions |
| :--- | :--- | :--- |
| `PLATFORM_ADMIN` | Global | Manage all tenants, monitor platform metrics, manage SaaS subscription tiers. |
| `BUSINESS_OWNER` | Tenant | Full administrative access to business profile, staff, services, billing, and reports. |
| `BUSINESS_MANAGER`| Tenant | Manage daily operations: staff schedules, service catálogo, appointments, and queue. |
| `STAFF` | Tenant | View assigned calendar, serve walk-in queue tokens, manage own breaks and leaves. |
| `CUSTOMER` | Public / Self | Discover businesses, view public slots, book appointments, check queue position. |

---

## 6. Technology Specifications

- **Backend Language:** Java 21 LTS (Temurin / OpenJDK)
- **Framework:** Spring Boot 3.3.5
- **ORM / Persistence:** Spring Data JPA, Hibernate 6.5.x
- **Schema Management:** Flyway 10.x with PostgreSQL native migrations
- **Database:** PostgreSQL 16 Alpine with `uuid-ossp` and `btree_gist` extensions
- **Frontend Framework:** React 18.3, TypeScript 5.5, Vite 5.4
- **State Management & Data Fetching:** TanStack Query v5
- **Styling & UI:** Tailwind CSS, shadcn/ui design tokens, Lucide React
- **API Documentation:** OpenAPI 3.0 / Swagger UI via Springdoc v2.6.0
