import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CalendarClock, ClipboardCheck, Lock, Search, ShieldCheck, UserPlus } from 'lucide-react';
import { Logo } from '@/components/Logo';

const features = [
  {
    icon: ClipboardCheck,
    title: 'One-tap attendance',
    text: 'Students mark attendance for open sessions in a single tap — no paper, no queues.',
  },
  {
    icon: BarChart3,
    title: 'Live attendance stats',
    text: 'Attendance percentage and full history are calculated automatically after every class.',
  },
  {
    icon: CalendarClock,
    title: 'Session control',
    text: 'Lecturers open and close attendance sessions per course, department and level.',
  },
  {
    icon: Search,
    title: 'Search & filter',
    text: 'Instantly find any student or attendance record by name, matric number, department or level.',
  },
];

export function HomePage() {
  return (
    <div>
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(60rem 30rem at 85% -10%, rgba(37,99,235,0.55), transparent 60%), radial-gradient(40rem 24rem at 0% 110%, rgba(14,165,233,0.35), transparent 60%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center gap-8">
          <Logo size="lg" light />
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            The official attendance portal for the Faculty of Engineering, Lagos State University.
            Mark attendance in seconds, track your percentage in real time, and give administrators
            a complete, searchable record of every class.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/login"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-base shadow-xl shadow-blue-600/30 transition-all"
            >
              Student Login
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-base backdrop-blur transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              Create Account
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Lock className="h-4 w-4" />
            Demonstration mode — no real accounts are created yet
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-slate-950 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-blue-900/20">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Faculty administration access</h2>
            <p className="text-blue-100 leading-relaxed">
              The admin dashboard is restricted to authorised staff. Administrators manage attendance
              sessions, review every record and monitor class-wide attendance — students can never
              access it.
            </p>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-950 font-semibold hover:bg-blue-50 transition-colors shadow-lg shrink-0"
          >
            <ShieldCheck className="h-5 w-5 text-blue-700" />
            Admin sign in
          </Link>
        </div>
      </section>
    </div>
  );
}
