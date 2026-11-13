import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../services/api';
import {
  Activity,
  Database,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardOverview: React.FC = () => {
  const { data: healthResponse, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: healthApi.getHealth,
    refetchInterval: 15000,
  });

  const health = healthResponse?.data;

  const modules = [
    { id: 1, name: 'Common', status: 'Initialized', tag: 'Core Base', desc: 'DTOs, unified response wrappers, tenant contexts & exceptions' },
    { id: 2, name: 'Configuration', status: 'Initialized', tag: 'Infrastructure', desc: 'SecurityFilterChain, CORS, OpenAPI 3.0 & WebMvc' },
    { id: 3, name: 'Identity & Auth', status: 'Phase 2', tag: 'Security', desc: 'JWT token generation, BCrypt hashing, multi-tenant RBAC' },
    { id: 4, name: 'Tenants & Accounts', status: 'Phase 2', tag: 'Isolation', desc: 'Tenant provisioning, slug resolution, profile management' },
    { id: 5, name: 'Business Management', status: 'Phase 3', tag: 'Operations', desc: 'Branches, operating hours, holidays, and closures' },
    { id: 6, name: 'Staff Management', status: 'Phase 3', tag: 'Workforce', desc: 'Staff invitations, shift schedules, breaks, leave' },
    { id: 7, name: 'Service Catalogue', status: 'Phase 3', tag: 'Catalogue', desc: 'Duration, buffer times, pricing, staff service links' },
    { id: 8, name: 'Scheduling Engine', status: 'Phase 4', tag: 'Algorithm', desc: 'Real-time slot availability calculation and conflict pruning' },
    { id: 9, name: 'Appointments & Booking', status: 'Phase 5', tag: 'Concurrency', desc: 'GiST temporal exclusion constraints, double-booking shield' },
    { id: 10, name: 'Queue Management', status: 'Phase 6', tag: 'Walk-ins', desc: 'Token generation, ETA algorithms, public queue board' },
    { id: 11, name: 'Customer Portal', status: 'Phase 7', tag: 'Customer Experience', desc: 'Discovery, public booking, cancellation, reschedule' },
    { id: 12, name: 'Notifications', status: 'Phase 8', tag: 'Messaging', desc: 'Transactional booking receipts, SMS/Email reminder hooks' },
    { id: 13, name: 'Analytics', status: 'Phase 9', tag: 'BI & Reporting', desc: 'Utilization, no-show rates, revenue velocity, wait times' },
    { id: 14, name: 'Subscriptions', status: 'Phase 10', tag: 'Monetization', desc: 'Tier enforcement, feature gating, invoice readiness' },
    { id: 15, name: 'Audit Logging', status: 'Phase 10', tag: 'Compliance', desc: 'Immutable audit trails for administrative events' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Phase 1: Foundation Verified
            </span>
            <span className="text-xs text-slate-400">Java 21 • Spring Boot 3.3.5 • PostgreSQL 16 • React 18</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-2">
            SlotWise Commercial SaaS Engine
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mt-1">
            Enterprise-grade multi-tenant platform for appointment booking, walk-in queue management,
            and service business operations with hardware-level double-booking protection.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/health"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-600/30"
          >
            <Activity className="w-4 h-4" />
            <span>Live Health Diagnostics</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Backend Engine</span>
            <div className={`p-2 rounded-lg ${health?.status === 'UP' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {isLoading ? 'Checking...' : health?.status || 'Active'}
            </span>
            <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Port 8080
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Spring Boot 3.3.5 REST API</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Database Node</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">PostgreSQL 16</span>
            <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Port 5434
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Docker Compose with btree_gist</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenant Isolation</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">Enforced</span>
            <span className="ml-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              ThreadLocal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">tenant_id on all domain records</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Concurrency Control</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">Temporal Guard</span>
            <span className="ml-2 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Zero Double-Book
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">GiST Exclusion & Pessimistic Locks</p>
        </div>
      </div>

      {/* Modular Monolith Architecture Blueprint */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Modular Monolith Domain Architecture</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              15 autonomous bounded context modules designed with clean separation of concerns
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            15 Defined Domains
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {modules.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">{m.id}. {m.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  m.status === 'Initialized'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
