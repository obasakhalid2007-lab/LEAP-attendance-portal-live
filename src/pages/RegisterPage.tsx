import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/types';
import type { Department, Level } from '@/lib/types';
import { useStore } from '@/lib/store';

const levels: Level[] = ['100', '200', '300', '400', '500'];

export function RegisterPage() {
  const { registerStudent, signInStudent } = useStore();
  const navigate = useNavigate();
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

  const set = <K extends keyof typeof form>(key: K) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }) as typeof form);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.fullName.trim() || !form.matricNumber.trim() || !form.department || !form.level || !form.email.trim() || !form.password) {
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
    const created = registerStudent({
      fullName: form.fullName,
      matricNumber: form.matricNumber,
      department: form.department,
      level: form.level,
      email: form.email,
      password: form.password,
    });
    if (!created) {
      setError('A student with that matriculation number or email already exists.');
      return;
    }
    signInStudent(created.matricNumber);
    setSuccess('Account created. Taking you to your dashboard…');
    setTimeout(() => navigate('/dashboard'), 700);
  };

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition';

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Student registration</h1>
        <p className="text-sm text-slate-500 mb-6">Create your LEAP account with your LASU engineering details.</p>

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
            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
            <input id="fullName" value={form.fullName} onChange={set('fullName')} placeholder="e.g. Adebayo Oluwaseun Daniel" className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="matricNumber" className="block text-sm font-semibold text-slate-700 mb-1.5">Matriculation number</label>
              <input id="matricNumber" value={form.matricNumber} onChange={set('matricNumber')} placeholder="e.g. MEE/2023/0456" className={inputClass} />
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-semibold text-slate-700 mb-1.5">Level</label>
              <select id="level" value={form.level} onChange={set('level')} className={inputClass}>
                <option value="">Select level</option>
                {levels.map((l) => (
                  <option key={l} value={l}>{l} Level</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
            <select id="department" value={form.department} onChange={set('department')} className={inputClass}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@student.lasu.edu.ng" className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input id="password" type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" className={inputClass} />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm password</label>
              <input id="confirm" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" className={inputClass} />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 shadow-lg shadow-blue-600/25 transition-colors"
          >
            Create account
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
