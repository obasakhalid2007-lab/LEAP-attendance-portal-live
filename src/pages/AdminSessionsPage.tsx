import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { CalendarClock, CalendarPlus, Lock, Unlock, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { DEPARTMENTS } from '@/lib/types';
import type { AttendanceSession, Level } from '@/lib/types';

const allLevels: Array<Level | 'All Levels'> = ['All Levels', '100', '200', '300', '400', '500'];
const allDepartments: Array<typeof DEPARTMENTS[number] | 'All Departments'> = ['All Departments', ...DEPARTMENTS];

const emptyForm = {
  title: '',
  courseCode: '',
  department: 'All Departments' as AttendanceSession['department'],
  level: 'All Levels' as AttendanceSession['level'],
  date: new Date().toISOString().slice(0, 10),
  startTime: '08:00',
  endTime: '10:00',
};

export function AdminSessionsPage() {
  const { sessions, records, createSession, setSessionStatus, deleteSession } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sessions
      .filter((s) => (statusFilter === 'all' ? true : s.status === statusFilter))
      .filter((s) => !q || s.title.toLowerCase().includes(q) || s.courseCode.toLowerCase().includes(q))
      .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));
  }, [sessions, statusFilter, query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.courseCode.trim()) {
      setError('Give the session a title and course code.');
      return;
    }
    if (form.endTime <= form.startTime) {
      setError('End time must be after the start time.');
      return;
    }
    createSession({ ...form, title: form.title.trim(), courseCode: form.courseCode.trim().toUpperCase() });
    setForm({ ...emptyForm, date: form.date });
  };

  const marks = (sessionId: string) => records.filter((r) => r.sessionId === sessionId).length;

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent';

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25">
            <CalendarClock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Attendance sessions</h1>
            <p className="text-sm text-slate-500">Open, close and review every session</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions by title or course code…"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <div className="flex gap-2">
            {(['all', 'open', 'closed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                  statusFilter === f
                    ? 'bg-slate-950 text-white'
                    : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((session) => (
            <div key={session.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{session.courseCode}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      session.status === 'open'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {session.status === 'open' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                    {session.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>
                <p className="font-semibold text-slate-900 mt-1 truncate">{session.title}</p>
                <p className="text-sm text-slate-500">
                  {new Date(session.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  {' · '}{session.startTime}–{session.endTime}
                  {' · '}{session.department}
                  {' · '}{session.level === 'All Levels' ? 'All levels' : `${session.level} Level`}
                  {' · '}{marks(session.id)} marked
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {session.status === 'open' ? (
                  <button
                    onClick={() => setSessionStatus(session.id, 'closed')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <Lock className="h-4 w-4" />
                    Close
                  </button>
                ) : (
                  <button
                    onClick={() => setSessionStatus(session.id, 'open')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors"
                  >
                    <Unlock className="h-4 w-4" />
                    Reopen
                  </button>
                )}
                <button
                  onClick={() => deleteSession(session.id)}
                  aria-label="Delete session"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No sessions match your filters.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sm:p-6 lg:sticky lg:top-20">
        <h2 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
          <CalendarPlus className="h-5 w-5 text-blue-700" />
          New session
        </h2>
        {error && <p className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-800">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Session title, e.g. Thermodynamics I" className={inputClass} />
          <input value={form.courseCode} onChange={(e) => setForm((f) => ({ ...f, courseCode: e.target.value }))} placeholder="Course code, e.g. MEE 301" className={inputClass} />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value as AttendanceSession['department'] }))} className={inputClass} aria-label="Department">
              {allDepartments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as AttendanceSession['level'] }))} className={inputClass} aria-label="Level">
              {allLevels.map((l) => (
                <option key={l} value={l}>{l === 'All Levels' ? 'All Levels' : `${l} Level`}</option>
              ))}
            </select>
          </div>
          <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inputClass} aria-label="Date" />
          <div className="grid grid-cols-2 gap-3">
            <input type="time" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} className={inputClass} aria-label="Start time" />
            <input type="time" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} className={inputClass} aria-label="End time" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 shadow-lg shadow-blue-600/25 transition-colors">
            Create session
          </button>
          <p className="text-xs text-slate-400">New sessions open immediately and appear on the dashboards of matching students.</p>
        </form>
      </div>
    </div>
  );
}
