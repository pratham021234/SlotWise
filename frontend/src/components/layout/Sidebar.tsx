import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users2,
  Briefcase,
  UserSquare2,
  BarChart3,
  CreditCard,
  Activity,
  Layers,
  Settings,
  Flame,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Overview', to: '/', icon: LayoutDashboard },
    { label: 'Live Queue', to: '/queue', icon: Users2, badge: 'Live' },
    { label: 'Appointments', to: '/appointments', icon: CalendarDays },
    { label: 'Services', to: '/services', icon: Briefcase },
    { label: 'Staff Management', to: '/staff', icon: UserSquare2 },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Subscriptions', to: '/subscriptions', icon: CreditCard },
    { label: 'System Health', to: '/health', icon: Activity },
    { label: 'Roadmap & Specs', to: '/roadmap', icon: Layers },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Operations
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Multi-Tenant Security & Isolation Notice Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs space-y-1.5">
          <div className="flex items-center space-x-1.5 text-slate-800 font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Concurrency Guard</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Double-booking prevention is enforced with PostgreSQL temporal exclusion constraints.
          </p>
        </div>
      </div>
    </aside>
  );
};

