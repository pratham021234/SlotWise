import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './pages/DashboardOverview';
import { HealthDiagnostics } from './pages/HealthDiagnostics';
import { RoadmapSpec } from './pages/RoadmapSpec';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const PlaceholderPage: React.FC<{ title: string; phase: string }> = ({ title, phase }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
      <span className="font-bold text-lg">SW</span>
    </div>
    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    <p className="text-sm text-slate-500 max-w-md mx-auto">
      This domain module is scheduled for implementation in <strong>{phase}</strong> as part of the phased engineering roadmap.
    </p>
    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
      Architecture & Database Schema Prepared
    </span>
  </div>
);

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto max-w-7xl">
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/health" element={<HealthDiagnostics />} />
                <Route path="/roadmap" element={<RoadmapSpec />} />
                <Route path="/queue" element={<PlaceholderPage title="Walk-In Live Queue Management" phase="Phase 6" />} />
                <Route path="/appointments" element={<PlaceholderPage title="Appointment Management & Calendar" phase="Phase 5" />} />
                <Route path="/services" element={<PlaceholderPage title="Service Catalogue & Pricing" phase="Phase 3" />} />
                <Route path="/staff" element={<PlaceholderPage title="Staff Workforce & Shifts" phase="Phase 3" />} />
                <Route path="/analytics" element={<PlaceholderPage title="Operational Analytics & Reporting" phase="Phase 9" />} />
                <Route path="/subscriptions" element={<PlaceholderPage title="SaaS Subscriptions & Billing" phase="Phase 10" />} />
                <Route path="/settings" element={<PlaceholderPage title="Business & Tenant Settings" phase="Phase 2" />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

