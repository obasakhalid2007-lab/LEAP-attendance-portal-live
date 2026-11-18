import { useState } from 'react';
import type { FormEvent } from 'react';
import { AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';

export function AdminGatePage() {
  const { signInAdmin } = useStore();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (passcode.trim() === 'leap-admin-2026') {
      signInAdmin();
    } else {
      setError('Incorrect passcode. This area is restricted to faculty staff.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
        <div className="h-12 w-12 rounded-xl bg-slate-950 text-blue-400 flex items-center justify-center mb-5">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Staff administration</h1>
        <p className="text-sm text-slate-500 mb-6">
          This dashboard is restricted to authorised faculty staff. Students cannot access it — when
          Supabase authentication is connected, admin rights will be enforced server-side.
        </p>

        <div className="mb-6 rounded-xl bg-blue-50 border border-blue-100 p-3.5 text-sm text-blue-900">
          Demonstration passcode: <span className="font-semibold">leap-admin-2026</span>
        </div>

        {error && (
          <div className="mb-5 flex gap-3 rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="passcode" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Staff passcode
            </label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter staff passcode"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold py-3.5 shadow-lg transition-colors"
          >
            <KeyRound className="h-4 w-4" />
            Enter admin dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
