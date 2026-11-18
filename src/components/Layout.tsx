import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '@/lib/store';

export function Layout({ children }: { children: ReactNode }) {
  const { viewer, signOut } = useStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setMenuOpen(false);
    navigate('/');
  };

  const isStudent = viewer.role === 'student';
  const isAdmin = viewer.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-950 text-white sticky top-0 z-40 shadow-lg shadow-slate-950/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="shrink-0" aria-label="LEAP home">
            <Logo size="sm" light />
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {isStudent && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <UserRound className="h-4 w-4" />
                My Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            )}
            {viewer.role === 'guest' ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/30"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                className="ml-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            )}
          </nav>

          <button
            className="sm:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="sm:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
            {isStudent && (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10">
                <UserRound className="h-4 w-4" />
                My Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10">
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
            {viewer.role === 'guest' ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-white/10">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white">
                  Register
                </Link>
              </>
            ) : (
              <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10 text-left">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-950 text-slate-400 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>LEAP — Lagos State University, Faculty of Engineering</span>
          </div>
          <span>Demonstration mode — real authentication arrives with Supabase</span>
        </div>
      </footer>
    </div>
  );
}
