import React from 'react';
import { CalendarClock, Bell, User, Building2 } from 'lucide-react';

interface NavbarProps {
  tenantName?: string;
  isBackendHealthy?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenantName = 'Default Tenant',
  isBackendHealthy = true,
}) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Slot<span className="text-blue-600">Wise</span></span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              SaaS v1.0
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{tenantName}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
            Multi-Tenant Isolation
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Backend Connectivity Status Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{isBackendHealthy ? 'API Engine Active' : 'Connecting to API'}</span>
        </div>

        <button
          aria-label="Notifications"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">System Admin</p>
            <p className="text-[11px] text-slate-500 leading-none mt-1">Platform Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
