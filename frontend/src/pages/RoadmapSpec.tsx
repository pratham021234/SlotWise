import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export const RoadmapSpec: React.FC = () => {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Foundation, Multi-Tenancy Baseline & Health Architecture',
      status: 'Completed',
      items: [
        'Java 21 OpenJDK environment setup and configuration',
        'Maven multi-tenant Spring Boot 3.3.5 backend scaffolding',
        'Docker Compose PostgreSQL 16 container with btree_gist extension',
        'Flyway V1 baseline migration (tenants and users tables)',
        'Unified ApiResponse<T>, ApiError, and GlobalExceptionHandler',
        'TenantContext & TenantContextHolder ThreadLocal isolation primitives',
        'Spring Security stateless JWT filter chain and BCrypt encoder',
        'GET /api/v1/health endpoint with PostgreSQL connection probes',
        'React 18 + Vite + TypeScript + Tailwind CSS application shell',
      ],
    },
    {
      phase: 'Phase 2',
      title: 'Multi-Tenant Authentication & Organization Accounts',
      status: 'Next Up',
      items: [
        'JWT token creation, validation, and refresh rotation',
        'Business owner tenant onboarding & registration API',
        'Role-based access control (Platform Admin, Business Owner, Manager, Staff, Customer)',
        'Tenant resolution filter: subdomain, slug header, and JWT claims',
        'Prevent cross-tenant leakage test suite',
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Business Management, Staff & Service Catalogue',
      status: 'Planned',
      items: [
        'Branch configuration, working hours, and holiday schedules',
        'Staff management with service assignments and shift breaks',
        'Service catalogue with durations, pricing, and buffer times',
      ],
    },
    {
      phase: 'Phase 4 & 5',
      title: 'Scheduling Engine & Concurrency Double-Booking Prevention',
      status: 'Critical Planned',
      items: [
        'Real-time availability slot generator',
        'PostgreSQL GiST exclusion constraint on tstzrange for staff slot locks',
        'Distributed lock integration (Redis) & Idempotency key evaluation',
        'Automated multi-threaded concurrency stress test suite',
      ],
    },
    {
      phase: 'Phase 6 & 7',
      title: 'Live Walk-in Queue System & Public Booking Portal',
      status: 'Planned',
      items: [
        'Queue token generation, priority, and dynamic wait time estimation',
        'Live queue dashboard for staff with Next Customer call',
        'Public-facing discovery and responsive booking page for customers',
        'Public queue position tracking page with live polling',
      ],
    },
    {
      phase: 'Phase 8 - 10',
      title: 'Notifications, SaaS Subscriptions & Production Hardening',
      status: 'Planned',
      items: [
        'Transactional notification system for booking confirmations',
        'SaaS tiered subscription limits (Free vs Pro) and feature gating',
        'Audit logging for tenant operations',
        'Docker multi-stage builds and GitHub Actions CI pipeline',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Implementation Roadmap & Specs</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Step-by-step verified execution plan for the SlotWise commercial SaaS platform
        </p>
      </div>

      <div className="space-y-4">
        {phases.map((p, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  p.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : p.status === 'Next Up'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {p.phase}
                </span>
                <h2 className="text-base font-bold text-slate-900">{p.title}</h2>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {p.status}
              </span>
            </div>

            <ul className="mt-3.5 space-y-2">
              {p.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start space-x-2 text-xs text-slate-600">
                  {p.status === 'Completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
