import type { AttendanceRecord, AttendanceSession, Level, Student } from './types';

const studentsRaw: Array<[string, string, Student['department'], Level, string]> = [
  ['Adebayo Oluwaseun Daniel', 'CHE/2021/0142', 'Chemical Engineering', '300', 'adebayo.d@student.lasu.edu.ng'],
  ['Okafor Chiamaka Blessing', 'EEE/2022/0388', 'Electrical & Electronics Engineering', '200', 'okafor.c@student.lasu.edu.ng'],
  ['Balogun Ibrahim Kazeem', 'MEE/2020/0091', 'Mechanical Engineering', '400', 'balogun.i@student.lasu.edu.ng'],
  ['Nwosu Adaeze Grace', 'CVE/2021/0233', 'Civil Engineering', '300', 'nwosu.a@student.lasu.edu.ng'],
  ['Ogunleye Temitope Samson', 'CEN/2022/0410', 'Computer Engineering', '200', 'ogunleye.t@student.lasu.edu.ng'],
  ['Sulaimon Fatima Opeyemi', 'MEE/2021/0176', 'Mechanical Engineering', '300', 'sulaimon.f@student.lasu.edu.ng'],
  ['Eze Michael Chinedu', 'EEE/2020/0254', 'Electrical & Electronics Engineering', '400', 'eze.m@student.lasu.edu.ng'],
  ['Adeyemi Bukola Maryam', 'CVE/2022/0367', 'Civil Engineering', '200', 'adeyemi.b@student.lasu.edu.ng'],
  ['Umeh Kelechi Anthony', 'CEN/2020/0108', 'Computer Engineering', '400', 'umeh.k@student.lasu.edu.ng'],
  ['Lawal Sherif Olatunji', 'CHE/2022/0319', 'Chemical Engineering', '200', 'lawal.s@student.lasu.edu.ng'],
  ['Obi Ngozi Peace', 'MEE/2019/0072', 'Mechanical Engineering', '500', 'obi.n@student.lasu.edu.ng'],
  ['Adeleke Oluwatosin Peter', 'CVE/2020/0185', 'Civil Engineering', '400', 'adeleke.o@student.lasu.edu.ng'],
];

export const seedStudents: Student[] = studentsRaw.map(([fullName, matricNumber, department, level, email], i) => ({
  id: `student-${i + 1}`,
  fullName,
  matricNumber,
  department,
  level,
  email,
}));

export const currentStudentId = 'student-1';

const sessionsRaw: Array<[string, string, AttendanceSession['department'], AttendanceSession['level'], string, string, string, AttendanceSession['status']]> = [
  ['Engineering Mathematics III — Morning Lecture', 'MTH 301', 'All Departments', '300', '2026-11-18', '08:00', '10:00', 'open'],
  ['Thermodynamics I — Week 9 Class', 'MEE 301', 'Mechanical Engineering', '300', '2026-11-18', '10:00', '12:00', 'open'],
  ['Circuit Theory — Lab Session', 'EEE 305', 'Electrical & Electronics Engineering', '400', '2026-11-17', '14:00', '16:00', 'closed'],
  ['Strength of Materials — Week 8', 'MEE 305', 'Mechanical Engineering', '400', '2026-11-16', '09:00', '11:00', 'closed'],
  ['Fluid Mechanics — Lecture 12', 'MEE 304', 'Mechanical Engineering', '300', '2026-11-13', '08:00', '10:00', 'closed'],
  ['Software Engineering Fundamentals', 'CEN 401', 'Computer Engineering', '400', '2026-11-12', '12:00', '14:00', 'closed'],
  ['Structural Analysis II', 'CVE 402', 'Civil Engineering', '400', '2026-11-11', '08:00', '10:00', 'closed'],
  ['Chemical Process Principles', 'CHE 301', 'Chemical Engineering', '300', '2026-11-10', '10:00', '12:00', 'closed'],
  ['Digital Electronics Workshop', 'CEN 305', 'Computer Engineering', '300', '2026-11-06', '14:00', '17:00', 'closed'],
  ['Engineering Graphics & Design', 'GEN 102', 'All Departments', '100', '2026-11-04', '08:00', '11:00', 'closed'],
  ['Control Systems I', 'EEE 401', 'Electrical & Electronics Engineering', '400', '2026-10-30', '09:00', '11:00', 'closed'],
  ['Heat Transfer Fundamentals', 'MEE 406', 'Mechanical Engineering', '400', '2026-10-28', '10:00', '12:00', 'closed'],
];

export const seedSessions: AttendanceSession[] = sessionsRaw.map(
  ([title, courseCode, department, level, date, startTime, endTime, status], i) => ({
    id: `session-${i + 1}`,
    title,
    courseCode,
    department,
    level,
    date,
    startTime,
    endTime,
    status,
  })
);

const recordsRaw: Array<[string, string, string]> = [
  // Current demo student attends everything except 3 missed sessions.
  ['student-1', 'session-1', '2026-11-18T08:42:00'],
  ['student-1', 'session-2', '2026-11-18T10:21:00'],
  ['student-1', 'session-3', '2026-11-17T14:03:00'],
  ['student-1', 'session-5', '2026-11-13T08:11:00'],
  ['student-1', 'session-6', '2026-11-12T12:24:00'],
  ['student-1', 'session-7', '2026-11-11T08:05:00'],
  ['student-1', 'session-8', '2026-11-10T10:14:00'],
  ['student-1', 'session-9', '2026-11-06T14:31:00'],
  ['student-1', 'session-10', '2026-11-04T08:19:00'],
  ['student-1', 'session-11', '2026-10-30T09:09:00'],
  // Other students, a realistic spread.
  ['student-2', 'session-1', '2026-11-18T08:30:00'],
  ['student-2', 'session-2', '2026-11-18T10:10:00'],
  ['student-2', 'session-3', '2026-11-17T14:12:00'],
  ['student-2', 'session-9', '2026-11-06T14:22:00'],
  ['student-2', 'session-10', '2026-11-04T08:45:00'],
  ['student-3', 'session-2', '2026-11-18T10:33:00'],
  ['student-3', 'session-4', '2026-11-16T09:02:00'],
  ['student-3', 'session-5', '2026-11-13T08:20:00'],
  ['student-3', 'session-6', '2026-11-12T12:09:00'],
  ['student-3', 'session-12', '2026-10-28T10:40:00'],
  ['student-4', 'session-1', '2026-11-18T08:55:00'],
  ['student-4', 'session-3', '2026-11-17T14:26:00'],
  ['student-4', 'session-7', '2026-11-11T08:31:00'],
  ['student-4', 'session-8', '2026-11-10T10:19:00'],
  ['student-5', 'session-1', '2026-11-18T08:22:00'],
  ['student-5', 'session-6', '2026-11-12T12:15:00'],
  ['student-5', 'session-9', '2026-11-06T14:29:00'],
  ['student-5', 'session-10', '2026-11-04T08:52:00'],
  ['student-6', 'session-1', '2026-11-18T08:37:00'],
  ['student-6', 'session-2', '2026-11-18T10:15:00'],
  ['student-6', 'session-5', '2026-11-13T08:08:00'],
  ['student-6', 'session-8', '2026-11-10T10:22:00'],
  ['student-7', 'session-3', '2026-11-17T14:05:00'],
  ['student-7', 'session-4', '2026-11-16T09:11:00'],
  ['student-7', 'session-11', '2026-10-30T09:17:00'],
  ['student-7', 'session-12', '2026-10-28T10:31:00'],
  ['student-8', 'session-1', '2026-11-18T08:47:00'],
  ['student-8', 'session-10', '2026-11-04T08:28:00'],
  ['student-8', 'session-7', '2026-11-11T08:39:00'],
  ['student-9', 'session-4', '2026-11-16T09:19:00'],
  ['student-9', 'session-6', '2026-11-12T12:28:00'],
  ['student-9', 'session-11', '2026-10-30T09:23:00'],
  ['student-9', 'session-12', '2026-10-28T10:36:00'],
  ['student-10', 'session-1', '2026-11-18T08:59:00'],
  ['student-10', 'session-2', '2026-11-18T10:26:00'],
  ['student-10', 'session-8', '2026-11-10T10:31:00'],
  ['student-11', 'session-2', '2026-11-18T10:04:00'],
  ['student-11', 'session-5', '2026-11-13T08:26:00'],
  ['student-11', 'session-6', '2026-11-12T12:11:00'],
  ['student-12', 'session-1', '2026-11-18T08:13:00'],
  ['student-12', 'session-3', '2026-11-17T14:18:00'],
  ['student-12', 'session-7', '2026-11-11T08:14:00'],
];

export const seedRecords: AttendanceRecord[] = recordsRaw.map(([studentId, sessionId, markedAt], i) => ({
  id: `record-${i + 1}`,
  studentId,
  sessionId,
  markedAt,
}));
