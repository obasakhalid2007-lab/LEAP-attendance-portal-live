
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/types';
import type { Department, Level } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const levels: Level[] = ['100', '200', '300', '400', '500'];

export function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    matricNumber: '',
    department: '' as Department | '',
    level: '' as Level | '',
    email: '',
    password: '',
    confirm: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) =>
    (e: { target: { value: string } }) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !form.fullName.trim() ||
      !form.matricNumber.trim() ||
      !form.department ||
      !form.level ||
      !form.email.trim() ||
      !form.password
    ) {
      setError('Please fill in every field.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Enter a valid email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            matric_number: form.matricNumber.trim().toUpperCase(),
            department: form.department,
            level: form.level,
            email: form.email.trim().toLowerCase(),
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user && data.user.identities?.length === 0) {
        throw new Error('This email is already registered. Please sign in.');
      }

      setSuccess(
        'Registration successful! Check your email and click the confirmation link before signing in with your matriculation number and password.'
      );

      setForm({
        fullName: '',
        matricNumber: '',
        department: '',
        level: '',
        email: '',
        password: '',
        confirm: '',
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition';

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Student registration
        </h1>

        <p className="text-sm text-slate-500 mb-6">
          Create your LEAP account with your LASU engineering details.
        </p>

        {error && (
          <div className="mb-5 flex gap-3 rounded-xl bg-red-50 border border-red-100 p-3.5 text-sm text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 flex gap-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-sm text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full name
            </label>
            <input
              id="fullName"
              required
              value={form.fullName}
              onChange={set('fullName')}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="matricNumber" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Matriculation number
              </label>
              <input
                id="matricNumber"
                required
                value={form.matricNumber}
                onChange={set('matricNumber')}
                placeholder="e.g. MEE/2023/0456"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Level
              </label>
              <select
                id="level"
                required
                value={form.level}
                onChange={set('level')}
                className={inputClass}
              >
                <option value="">Select level</option>
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l} Level
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Department
            </label>
            <select
              id="department"
              required
              value={form.department}
              onChange={set('department')}
              className={inputClass}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="Your email address"
              className={inputClass}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 6 characters"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="Repeat password"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3.5 shadow-lg shadow-blue-600/25 transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
