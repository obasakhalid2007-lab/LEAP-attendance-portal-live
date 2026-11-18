import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { CalendarClock, Users } from 'lucide-react';
import { AdminStudentsPage } from './AdminStudentsPage';
import { AdminSessionsPage } from './AdminSessionsPage';

export function AdminDashboardPage() {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-200/60'
    }`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex gap-2 mb-8 bg-slate-100 border border-slate-200 rounded-2xl p-1.5 w-fit">
        <NavLink to="/admin/students" className={tabClass}>
          <Users className="h-4 w-4" />
          Students
        </NavLink>
        <NavLink to="/admin/sessions" className={tabClass}>
          <CalendarClock className="h-4 w-4" />
          Sessions
        </NavLink>
      </div>

      <Routes>
        <Route index element={<Navigate to="/admin/students" replace />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="sessions" element={<AdminSessionsPage />} />
        <Route path="*" element={<Navigate to="/admin/students" replace />} />
      </Routes>

      <p className="mt-8 text-sm text-slate-400">
        Looking for the student portal?{' '}
        <Link to="/" className="font-semibold text-blue-700 hover:text-blue-800">
          Go to the homepage
        </Link>
      </p>
    </div>
  );
}
