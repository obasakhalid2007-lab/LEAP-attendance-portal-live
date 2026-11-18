import { GraduationCap } from 'lucide-react';

export function Logo({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const box = size === 'lg' ? 'h-16 w-16' : size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const icon = size === 'lg' ? 'h-9 w-9' : size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  const title = size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-lg' : 'text-2xl';

  return (
    <div className="flex items-center gap-3">
      <div className={`${box} rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25`}>
        <GraduationCap className={`${icon} text-white`} strokeWidth={2.2} />
      </div>
      <div className="leading-tight">
        <span className={`${title} font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
          LEAP
        </span>
        <p className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-widest ${light ? 'text-blue-200' : 'text-slate-500'}`}>
          LASU Engineering Attendance Portal
        </p>
      </div>
    </div>
  );
}
