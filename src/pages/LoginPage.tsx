import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Info, Lock } from 'lucide-react';
import { useStore } from '@/lib/store';

export function LoginPage() {
  const { signInStudent } = useStore();
  const navigate = useNavigate();
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!matricNumber.trim() || !password) {
      setError('Enter your matriculation number and password.');
      return;
    }
    const student = signInStudent(matricNumber);
    if (!student) {
      setError('No student found with that matriculation number. Try a demo number like MEE/2020/0091.');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Student login</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in with your matriculation number to access your dashboard.</p>

        <div className="mb-6 flex gap-3 rounded-xl bg-blue-50 border border-blue-100 p-3.5 text-sm text-blue-900">
          <Info className="h-5 w-5 shrink-0 text-blue-600" />
          <p>
            Demonstration mode: any registered demo matric number works, e.g.{' '}
            <span className="font-semibold">MEE/2020/0091</span>. Passwords are not verified until
            real authentication is connected.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex gap-3 rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="matric" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Matriculation number
            </label>
            <input
              id="matric"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
              placeholder="e.g. MEE/2020/0091"
              autoComplete="username"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 shadow-lg shadow-blue-600/25 transition-colors"
          >
            <Lock className="h-4 w-4" />
            Sign in
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          New to LEAP?{' '}
          <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
