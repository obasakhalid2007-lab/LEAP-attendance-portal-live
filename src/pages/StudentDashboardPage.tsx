import { useMemo } from 'react';
import { CalendarDays, CheckCircle2, ClipboardCheck, Clock, Info, TrendingUp } from 'lucide-react';
import { useStore } from '@/lib/store';
import { DEPARTMENTS } from '@/lib/types';
import type { Level } from '@/lib/types';

export function StudentDashboardPage() {
  const { viewer, students, sessions, records, markAttendance } = useStore();

  const student = students.find((s) => s.id === (viewer.role === 'student' ? viewer.studentId : ''));

  const myRecords = useMemo(
    () => (student ? records.filter((r) => r.studentId === student.id) : []),
    [records, student]
  );

  const availableSessions = useMemo(
    () =>
      student
        ? sessions
            .filter((s) => s.status === 'open')
            .filter((s) => s.department === 'All Departments' || s.department === student.department)
            .filter((s) => s.level === 'All Levels' || s.level === student.level)
            .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
        : [],
    [sessions, student]
  );

  const history = useMemo(
    () =>
      myRecords
        .map((r) => ({ record: r, session: sessions.find((s) => s.id === r.sessionId) }))
        .filter((h): h is { record: typeof myRecords[number]; session: NonNullable<typeof h.session> } => Boolean(h.session))
        .sort((a, b) => b.record.markedAt.localeCompare(a.record.markedAt)),
    [myRecords, sessions]
  );

  const openEligible = availableSessions.length;

  const markedOpen = myRecords.filter((r) => {
    const s = sessions.find((x) => x.id === r.sessionId);
    return s && s.status === 'open';
  }).length;

  const unmarked = openEligible - markedOpen;

  const totalRelevant = student
    ? sessions.filter(
        (s) =>
          (s.department === 'All Departments' || s.department === student.department) &&
          (s.level === 'All Levels' || s.level === student.level)
      ).length
    : 0;
  const percentage = totalRelevant > 0 ? Math.round((myRecords.length / totalRelevant) * 100) : 0;

  if (!student) return null;

  const stats = [
    { icon: TrendingUp, label: 'Attendance rate', value: `${percentage}%`, tone: 'bg-blue-600' },
    { icon: CheckCircle2, label: 'Sessions attended', value: String(myRecords.length), tone: 'bg-emerald-600' },
    { icon: CalendarDays, label: 'Open sessions', value: String(openEligible), tone: 'bg-slate-900' },
    { icon: Clock, label: 'Awaiting your mark', value: String(Math.max(unmarked, 0)), tone: 'bg-amber-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">Student dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{student.fullName}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {student.matricNumber} · {student.department} · {student.level} Level
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <div className={`h-9 w-9 rounded-lg ${tone} text-white flex items-center justify-center mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{value}</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Open attendance sessions</h2>
        {availableSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No open sessions for your department and level right now. You will see them here as soon as a lecturer opens one.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {availableSessions.map((session) => {
              const alreadyMarked = myRecords.some((r) => r.sessionId === session.id);
              return (
                <div key={session.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">{session.courseCode}</p>
                      <h3 className="font-bold text-slate-900 mt-0.5">{session.title}</h3>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Open
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {new Date(session.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {' · '}{session.startTime}–{session.endTime}
                  </p>
                  {alreadyMarked ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-3.5 font-semibold text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Attendance recorded
                    </div>
                  ) : (
                    <button
                      onClick={() => markAttendance(student.id, session.id)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
                    >
                      <ClipboardCheck className="h-5 w-5" />
                      MARK ATTENDANCE
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Attendance history</h2>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <TrendingUp className="h-4 w-4" />
            {percentage}% overall
          </div>
        </div>
        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            You have not marked any attendance yet.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {history.map(({ record, session }) => (
                <li key={record.id} className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="h-9 w-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{session.courseCode} — {session.title}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(record.markedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {session.status === 'open' ? 'Open session' : 'Closed'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="mt-8 flex gap-3 rounded-xl bg-slate-100 border border-slate-200 p-4 text-sm text-slate-600">
        <Info className="h-5 w-5 shrink-0 text-slate-500" />
        <p>
          Demonstration data: your percentage is calculated against all sessions for your department
          and level. This account is one of {students.length} demo students.
        </p>
      </div>
    </div>
  );
}
