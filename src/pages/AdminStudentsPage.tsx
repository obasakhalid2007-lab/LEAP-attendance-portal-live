import { useMemo, useState } from 'react';
import { CheckCircle2, LayoutDashboard, Users, XCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { DEPARTMENTS } from '@/lib/types';
import type { Level } from '@/lib/types';

const allLevels: Array<Level | 'All Levels'> = ['All Levels', '100', '200', '300', '400', '500'];
const allDepartments: Array<typeof DEPARTMENTS[number] | 'All Departments'> = ['All Departments', ...DEPARTMENTS];

export function AdminStudentsPage() {
  const { students, sessions, records } = useStore();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState<string>('All Departments');
  const [level, setLevel] = useState<string>('All Levels');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (department !== 'All Departments' && s.department !== department) return false;
      if (level !== 'All Levels' && s.level !== level) return false;
      if (!q) return true;
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.matricNumber.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    });
  }, [students, query, department, level]);

  const attendanceRate = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return 0;
    const relevant = sessions.filter(
      (s) =>
        (s.department === 'All Departments' || s.department === student.department) &&
        (s.level === 'All Levels' || s.level === student.level)
    );
    if (relevant.length === 0) return 0;
    const attended = records.filter((r) => r.studentId === studentId).length;
    return Math.round((attended / relevant.length) * 100);
  };

  const selectClass =
    'rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Students</h1>
          <p className="text-sm text-slate-500">{students.length} registered engineering students</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, matric number or department…"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className={selectClass} aria-label="Filter by department">
          {allDepartments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass} aria-label="Filter by level">
          {allLevels.map((l) => (
            <option key={l} value={l}>{l === 'All Levels' ? 'All Levels' : `${l} Level`}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-slate-950 text-white text-left">
                <th className="px-5 py-3.5 font-semibold">Full name</th>
                <th className="px-5 py-3.5 font-semibold">Matric number</th>
                <th className="px-5 py-3.5 font-semibold">Department</th>
                <th className="px-5 py-3.5 font-semibold">Level</th>
                <th className="px-5 py-3.5 font-semibold">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const rate = attendanceRate(s.id);
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{s.fullName}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{s.matricNumber}</td>
                    <td className="px-5 py-3.5 text-slate-600">{s.department}</td>
                    <td className="px-5 py-3.5 text-slate-600">{s.level} Level</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          rate >= 75
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rate >= 50
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {rate >= 75 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    No students match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
        <LayoutDashboard className="h-3.5 w-3.5" />
        Scroll horizontally on small screens to see all columns.
      </p>
    </div>
  );
}
