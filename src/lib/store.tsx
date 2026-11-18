import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { currentStudentId, seedRecords, seedSessions, seedStudents } from './demoData';
import type { AttendanceRecord, AttendanceSession, Student } from './types';

type Viewer =
  | { role: 'guest' }
  | { role: 'student'; studentId: string }
  | { role: 'admin' };

export interface NewRegistration {
  fullName: string;
  matricNumber: string;
  department: Student['department'];
  level: Student['level'];
  email: string;
  password: string;
}

interface StoreValue {
  students: Student[];
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
  viewer: Viewer;
  signInStudent: (matricNumber: string) => Student | null;
  signInAdmin: () => void;
  signOut: () => void;
  registerStudent: (data: NewRegistration) => Student | null;
  markAttendance: (studentId: string, sessionId: string) => boolean;
  createSession: (data: Omit<AttendanceSession, 'id' | 'status'>) => void;
  setSessionStatus: (sessionId: string, status: AttendanceSession['status']) => void;
  deleteSession: (sessionId: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function attendanceFor(records: AttendanceRecord[], studentId: string, sessionId: string) {
  return records.find((r) => r.studentId === studentId && r.sessionId === sessionId);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [sessions, setSessions] = useState<AttendanceSession[]>(seedSessions);
  const [records, setRecords] = useState<AttendanceRecord[]>(seedRecords);
  const [viewer, setViewer] = useState<Viewer>({ role: 'guest' });

  const signInStudent = useCallback(
    (matricNumber: string) => {
      const normalized = matricNumber.trim().toUpperCase();
      const student = students.find((s) => s.matricNumber.toUpperCase() === normalized) ?? null;
      if (student) setViewer({ role: 'student', studentId: student.id });
      return student;
    },
    [students]
  );

  const signInAdmin = useCallback(() => setViewer({ role: 'admin' }), []);
  const signOut = useCallback(() => setViewer({ role: 'guest' }), []);

  const registerStudent = useCallback((data: NewRegistration) => {
    const matric = data.matricNumber.trim().toUpperCase();
    let created: Student | null = null;
    setStudents((prev) => {
      if (prev.some((s) => s.matricNumber.toUpperCase() === matric || s.email.toLowerCase() === data.email.toLowerCase())) {
        return prev;
      }
      created = {
        id: `student-${prev.length + 1}-${Date.now()}`,
        fullName: data.fullName.trim(),
        matricNumber: data.matricNumber.trim(),
        department: data.department,
        level: data.level,
        email: data.email.trim(),
      };
      return [...prev, created];
    });
    return created;
  }, []);

  const markAttendance = useCallback(
    (studentId: string, sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session || session.status !== 'open') return false;
      if (attendanceFor(records, studentId, sessionId)) return false;
      setRecords((prev) => [
        ...prev,
        { id: `record-${Date.now()}`, studentId, sessionId, markedAt: new Date().toISOString() },
      ]);
      return true;
    },
    [sessions, records]
  );

  const createSession = useCallback((data: Omit<AttendanceSession, 'id' | 'status'>) => {
    setSessions((prev) => [
      { id: `session-${Date.now()}`, status: 'open', ...data },
      ...prev,
    ]);
  }, []);

  const setSessionStatus = useCallback((sessionId: string, status: AttendanceSession['status']) => {
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, status } : s)));
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setRecords((prev) => prev.filter((r) => r.sessionId !== sessionId));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      students,
      sessions,
      records,
      viewer,
      signInStudent,
      signInAdmin,
      signOut,
      registerStudent,
      markAttendance,
      createSession,
      setSessionStatus,
      deleteSession,
    }),
    [
      students,
      sessions,
      records,
      viewer,
      signInStudent,
      signInAdmin,
      signOut,
      registerStudent,
      markAttendance,
      createSession,
      setSessionStatus,
      deleteSession,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
