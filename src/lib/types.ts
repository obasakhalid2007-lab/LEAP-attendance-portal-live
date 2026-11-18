export type Level = '100' | '200' | '300' | '400' | '500';

export const DEPARTMENTS = [
  'Mechanical Engineering',
  'Electronics & Computer Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Electrical Engineering',
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export interface Student {
  id: string;
  fullName: string;
  matricNumber: string;
  department: Department;
  level: Level;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  markedAt: string;
}

export type SessionStatus = 'open' | 'closed';

export interface AttendanceSession {
  id: string;
  title: string;
  courseCode: string;
  department: Department | 'All Departments';
  level: Level | 'All Levels';
  date: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
}
