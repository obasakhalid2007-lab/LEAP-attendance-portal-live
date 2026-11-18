
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { supabase } from './supabase';
import type {
  AttendanceRecord,
  AttendanceSession,
  Student,
} from './types';

type Viewer =
  | { role: 'guest' }
  | { role: 'student'; studentId: string }
  | { role: 'admin' };

interface StoreValue {
  students: Student[];
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
  viewer: Viewer;
  loading: boolean;
  signInAdmin: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  markAttendance: (studentId: string, sessionId: string) => Promise<boolean>;
  createSession: (
    data: Omit<AttendanceSession, 'id' | 'status'>
  ) => Promise<void>;
  setSessionStatus: (
    sessionId: string,
    status: AttendanceSession['status']
  ) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

function mapStudent(row: any): Student {
  return {
    id: row.user_id,
    fullName: row.full_name,
    matricNumber: row.matric_number,
    department: row.department,
    level: row.level,
    email: row.email,
  };
}

function mapSession(row: any): AttendanceSession {
  return {
    id: row.id,
    title: row.title,
    courseCode: row.course_code,
    department: row.department,
    level: row.level,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status,
  };
}

function mapRecord(row: any): AttendanceRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    sessionId: row.session_id,
    markedAt: row.marked_at,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [viewer, setViewer] = useState<Viewer>({ role: 'guest' });
  const [loading, setLoading] = useState(true);

  const clearData = useCallback(() => {
    setStudents([]);
    setSessions([]);
    setRecords([]);
    setViewer({ role: 'guest' });
  }, []);

  const loadUserData = useCallback(async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Your student profile could not be found.');
    }

    const student = mapStudent(profile);
    const isAdmin = profile.role === 'admin';

    setViewer(
      isAdmin
        ? { role: 'admin' }
        : { role: 'student', studentId: userId }
    );

    const [sessionResult, recordResult] = await Promise.all([
      supabase
        .from('attendance_sessions')
        .select('*')
        .order('date', { ascending: false }),
      supabase.from('attendance_records').select('*'),
    ]);

    if (sessionResult.error) throw sessionResult.error;
    if (recordResult.error) throw recordResult.error;

    setSessions((sessionResult.data || []).map(mapSession));
    setRecords((recordResult.data || []).map(mapRecord));

    if (isAdmin) {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setStudents((data || []).map(mapStudent));
    } else {
      setStudents([student]);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadSession = async (userId: string | null) => {
      if (!active) return;

      if (!userId) {
        clearData();
        setLoading(false);
        return;
      }

      try {
        await loadUserData(userId);
      } catch (error) {
        console.error('LEAP data loading error:', error);
        if (active) clearData();
      } finally {
        if (active) setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      void loadSession(data.session?.user.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') return;
      void loadSession(session?.user.id ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [clearData, loadUserData]);

  const signInAdmin = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      try {
        await loadUserData(data.user.id);

        const { data: profile, error: profileError } = await supabase
          .from('students')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          await supabase.auth.signOut();
          clearData();
          throw new Error(
            'This account does not have administrator access.'
          );
        }
      } catch (error) {
        await supabase.auth.signOut();
        clearData();
        throw error;
      }
    },
    [clearData, loadUserData]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    clearData();
  }, [clearData]);

  const markAttendance = useCallback(
    async (studentId: string, sessionId: string) => {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert({
          student_id: studentId,
          session_id: sessionId,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error(
            'You have already marked attendance for this session.'
          );
        }

        throw error;
      }

      setRecords((previous) => [...previous, mapRecord(data)]);
      return true;
    },
    []
  );

  const createSession = useCallback(
    async (data: Omit<AttendanceSession, 'id' | 'status'>) => {
      const { data: created, error } = await supabase
        .from('attendance_sessions')
        .insert({
          title: data.title,
          course_code: data.courseCode,
          department: data.department,
          level: data.level,
          date: data.date,
          start_time: data.startTime,
          end_time: data.endTime,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      setSessions((previous) => [mapSession(created), ...previous]);
    },
    []
  );

  const setSessionStatus = useCallback(
    async (sessionId: string, status: AttendanceSession['status']) => {
      const { error } = await supabase
        .from('attendance_sessions')
        .update({ status })
        .eq('id', sessionId);

      if (error) throw error;

      setSessions((previous) =>
        previous.map((session) =>
          session.id === sessionId
            ? { ...session, status }
            : session
        )
      );
    },
    []
  );

  const deleteSession = useCallback(async (sessionId: string) => {
    const { error } = await supabase
      .from('attendance_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;

    setSessions((previous) =>
      previous.filter((session) => session.id !== sessionId)
    );

    setRecords((previous) =>
      previous.filter((record) => record.sessionId !== sessionId)
    );
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      students,
      sessions,
      records,
      viewer,
      loading,
      signInAdmin,
      signOut,
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
      loading,
      signInAdmin,
      signOut,
      markAttendance,
      createSession,
      setSessionStatus,
      deleteSession,
    ]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
}
