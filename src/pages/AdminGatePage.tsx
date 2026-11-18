
import { useState } from 'react';
import type { FormEvent } from 'react';
import { AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';

export function AdminGatePage() {
  const { signInAdmin } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your administrator email and password.');
      return;
    }

    setLoading(true);

    try {
      await signInAdmin(email.trim(), password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Administrator login failed. Check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
        <div className="h-12 w-12 rounded-xl bg-slate-950 text-blue-400 flex items-center justify-center mb-5">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Staff administration
        </h1>

        <p className="text-sm text-slate-500 mb-6">
          Sign in using your authorised administrator account.
        </p>

        {error && (
          <div className="mb-5 flex gap-3 rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Administrator email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold py-3.5 shadow-lg transition-colors"
          >
            <KeyRound className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Enter admin dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
