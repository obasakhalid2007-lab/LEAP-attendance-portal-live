
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  CalendarClock,
  CalendarPlus,
  Lock,
  Unlock,
  Trash2,
  Download,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { DEPARTMENTS } from '@/lib/types';
import type { AttendanceSession, Level } from '@/lib/types';

const allLevels: Array<Level | 'All Levels'> = [
  'All Levels', '100', '200', '300', '400', '500',
];

const allDepartments: Array<typeof DEPARTMENTS[number] | 'All Departments'> = [
  'All Departments', ...DEPARTMENTS,
];

const emptyForm = {
  title: '',
  courseCode: '',
  department: 'All Departments' as AttendanceSession['department'],
  level: 'All Levels' as AttendanceSession['level'],
  date: new Date().toISOString().slice(0, 10),
  startTime: '08:00',
  endTime: '10:00',
};

const csvCell = (value: unknown) =>
  `"${String(value ?? '').replace(/"/g, '""')}"`;

export function AdminSessionsPage() {
  const { sessions, records, students, createSession, setSessionStatus, deleteSession } = useStore();

  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return sessions
      .filter((s) => statusFilter === 'all' || s.status === statusFilter)
      .filter((s) =>
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.courseCode.toLowerCase().includes(q)
      )
      .sort((a, b) =>
        (b.date + b.startTime).localeCompare(a.date + a.startTime)
      );
  }, [sessions, statusFilter, query]);

  const handleExport = () => {
    const rows = records.map((record) => {
      const student = students.find((s) => s.id === record.studentId);
      const session = sessions.find((s) => s.id === record.sessionId);

      return [
        student?.fullName ?? 'Unknown student',
        student?.matricNumber ?? '',
        student?.department ?? '',
        student?.level ?? '',
        session?.courseCode ?? '',
        session?.title ?? '',
        session?.date ?? '',
        session?.startTime ?? '',
        session?.endTime ?? '',
        record.markedAt,
      ];
    });

    const headers = [
      'Student Name',
      'Matric Number',
      'Department',
      'Level',
      'Course Code',
      'Session Title',
      'Session Date',
      'Start Time',
      'End Time',
      'Marked At',
    ];

    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LEAP-attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.courseCode.trim()) {
      setError('Enter a session title and course code.');
      return;
    }

    if (form.endTime <= form.startTime) {
      setError('End time must be after start time.');
      return;
    }

    setBusy(true);

    try {
      await createSession({
        ...form,
        title: form.title.trim(),
        courseCode: form.courseCode.trim().toUpperCase(),
      });

      setForm({ ...emptyForm, date: form.date });
      setSuccess('Attendance session created successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create session.');
    } finally {
      setBusy(false);
    }
  };

  const handleStatus = async (id: string, status: 'open' | 'closed') => {
    setError('');
    setSuccess('');
    setBusy(true);

    try {
      await setSessionStatus(id, status);
      setSuccess(`Session ${status === 'open' ? 'reopened' : 'closed'} successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update session.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this session and its attendance records?')) return;

    setError('');
    setSuccess('');
    setBusy(true);

    try {
      await deleteSession(id);
      setSuccess('Session deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete session.');
    } finally {
      setBusy(false);
    }
  };

  const marks = (sessionId: string) =>
    records.filter((r) => r.sessionId === sessionId).length;

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600';

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <CalendarClock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Attendance sessions
            </h1>
            <p className="text-sm text-slate-500">
              Open, close and review every session
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-800">
            {error}
          </p>
        )}

        {success && (
          <p className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-800">
            {success}
          </p>
        )}

        <button
          type="button"
          onClick={handleExport}
          disabled={records.length === 0}
          className="mb-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download Attendance CSV
        </button>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions..."
            className={inputClass}
          />

          <div className="flex gap-2">
            {(['all', 'open', 'closed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize ${
                  statusFilter === f
                    ? 'bg-slate-950 text-white'
                    : 'bg-white border border-slate-300 text-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-blue-700 uppercase">
                    {session.courseCode}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    session.status === 'open'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {session.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>

                <p className="font-semibold text-slate-900 mt-1">
                  {session.title}
                </p>

                <p className="text-sm text-slate-500">
                  {new Date(session.date + 'T00:00:00').toLocaleDateString('en-GB')}
                  {' · '}{session.startTime}–{session.endTime}
                  {' · '}{session.department}
                  {' · '}{session.level}
                  {' · '}{marks(session.id)} marked
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {session.status === 'open' ? (
                  <button
                    disabled={busy}
                    onClick={() => handleStatus(session.id, 'closed')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 text-white text-sm font-semibold disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4" />
                    Close
                  </button>
                ) : (
                  <button
                    disabled={busy}
                    onClick={() => handleStatus(session.id, 'open')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
                  >
                    <Unlock className="h-4 w-4" />
                    Reopen
                  </button>
                )}

                <button
                  disabled={busy}
                  onClick={() => handleDelete(session.id)}
                  aria-label="Delete session"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 disabled:opacity-50"
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Session title"
            className={inputClass}
            required
          />

          <input
            value={form.courseCode}
            onChange={(e) => setForm((f) => ({ ...f, courseCode: e.target.value }))}
            placeholder="Course code, e.g. MEE 301"
            className={inputClass}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.department}
              onChange={(e) => setForm((f) => ({
                ...f,
                department: e.target.value as AttendanceSession['department'],
              }))}
              className={inputClass}
            >
              {allDepartments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <select
              value={form.level}
              onChange={(e) => setForm((f) => ({
                ...f,
                level: e.target.value as AttendanceSession['level'],
              }))}
              className={inputClass}
            >
              {allLevels.map((l) => (
                <option key={l} value={l}>
                  {l === 'All Levels' ? l : `${l} Level`}
                </option>
              ))}
            </select>
          </div>

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className={inputClass}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              className={inputClass}
              required
            />
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3"
          >
            {busy ? 'Please wait...' : 'Create session'}
          </button>

          <p className="text-xs text-slate-400">
            New sessions open immediately and appear on matching student dashboards.
          </p>
        </form>
      </div>
    </div>
  );
}
