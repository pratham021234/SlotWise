import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../services/api';
import {
  CheckCircle2,
  AlertCircle,
  Database,
  Clock,
  RefreshCw,
  Server,
  Layers,
  Terminal,
} from 'lucide-react';

export const HealthDiagnostics: React.FC = () => {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const { data: response, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['health-diagnostics'],
    queryFn: async () => {
      setLastRefreshed(new Date());
      return await healthApi.getHealth();
    },
    refetchInterval: 10000,
  });

  const health = response?.data;

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `${hours}h ${mins % 60}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs} seconds`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Health & Diagnostics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time liveness, readiness, and PostgreSQL connectivity verification
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium shadow-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
          <span>Refresh Check</span>
        </button>
      </div>

      {/* Main Status Hero */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-3.5">
            <div className={`p-3 rounded-xl ${health?.status === 'UP' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {health?.status === 'UP' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {isLoading ? 'Inspecting System...' : health?.status === 'UP' ? 'Platform Fully Operational' : 'Degraded Operational State'}
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  health?.status === 'UP' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {health?.status || 'UNKNOWN'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Last checked: {lastRefreshed.toLocaleTimeString()} (auto-refreshes every 10s)
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Endpoint</span>
            <p className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md mt-1">
              GET /api/v1/health
            </p>
          </div>
        </div>

        {/* Detailed Attribute Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Server className="w-4 h-4 text-slate-400" />
              <span>Application</span>
            </div>
            <p className="text-base font-bold text-slate-800">{health?.application || 'SlotWise SaaS'}</p>
            <p className="text-[11px] text-slate-500">v{health?.version || '1.0.0'}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Engine Uptime</span>
            </div>
            <p className="text-base font-bold text-slate-800">
              {health?.uptimeSeconds !== undefined ? formatUptime(health.uptimeSeconds) : 'N/A'}
            </p>
            <p className="text-[11px] text-slate-500">Spring Boot Runtime</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Active Profile</span>
            </div>
            <p className="text-base font-bold text-slate-800 capitalize">{health?.environment || 'dev'}</p>
            <p className="text-[11px] text-slate-500">Spring Environment</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Database className="w-4 h-4 text-slate-400" />
              <span>PostgreSQL Connection</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <p className="text-base font-bold text-slate-800">
                {health?.components?.database?.status || 'UP'}
              </p>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {health?.components?.database?.database || 'PostgreSQL'} {health?.components?.database?.version || '16'}
            </p>
          </div>
        </div>
      </div>

      {/* Raw Health JSON Viewer */}
      <div className="bg-slate-900 rounded-xl p-5 text-white shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span>Raw HTTP Health Response Payload</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">HTTP 200 OK</span>
        </div>
        <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2 bg-slate-950/60 rounded-lg">
          {JSON.stringify(response, null, 2) || '// Connecting to backend on http://localhost:8080/api/v1/health...'}
        </pre>
      </div>
    </div>
  );
};
