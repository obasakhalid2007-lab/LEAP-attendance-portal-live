
import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { StudentDashboardPage } from '@/pages/StudentDashboardPage';
import { AdminGatePage } from '@/pages/AdminGatePage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { useStore } from '@/lib/store';

function RequireStudent({ children }: { children: ReactNode }) {
  const { viewer, loading } = useStore();

  if (loading) {
    return <div className="p-8 text-center">Checking your account...</div>;
  }

  if (
    !viewer ||
    (viewer.role !== 'student' && viewer.role !== 'admin')
  ) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { viewer, loading } = useStore();

  if (loading) {
    return <div className="p-8 text-center">Checking your account...</div>;
  }

  if (!viewer || viewer.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <RequireStudent>
              <StudentDashboardPage />
            </RequireStudent>
          }
        />

        <Route path="/admin" element={<AdminGatePage />} />

        <Route
          path="/admin/*"
          element={
            <RequireAdmin>
              <AdminDashboardPage />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
