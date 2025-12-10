import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import TeacherManagement from './pages/admin/TeacherManagement';
import ClassManagement from './pages/admin/ClassManagement';
import SubjectManagement from './pages/admin/SubjectManagement';
import AttendanceManagement from './pages/admin/AttendanceManagement';
import AttendanceReports from './pages/admin/AttendanceReports';
import BillingManagement from './pages/admin/BillingManagement';
import TimetableManagement from './pages/admin/TimetableManagement';
import AdminSettings from './pages/admin/AdminSettings';
import AddStudent from './pages/admin/AddStudent';
import AddTeacher from './pages/admin/AddTeacher';
import TeacherLayout from './components/layout/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import ParentLayout from './components/layout/ParentLayout';
import ParentDashboard from './pages/parent/ParentDashboard';
import TeacherClasses from './pages/teacher/TeacherClasses';
import TeacherTimetable from './pages/teacher/TeacherTimetable';
import TeacherMaterials from './pages/teacher/TeacherMaterials';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherExams from './pages/teacher/TeacherExams';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentResults from './pages/student/StudentResults';
import StudentFees from './pages/student/StudentFees';
import StudentMaterials from './pages/student/StudentMaterials';
import StudentProfile from './pages/student/StudentProfile';
import ParentCalendar from './pages/parent/ParentCalendar';
import ParentChildren from './pages/parent/ParentChildren';
import ParentFees from './pages/parent/ParentFees';
import ParentSettings from './pages/parent/ParentSettings';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/classes" element={<AdminLayout><ClassManagement /></AdminLayout>} />
          <Route path="/admin/subjects" element={<AdminLayout><SubjectManagement /></AdminLayout>} />
          <Route path="/admin/attendance" element={<AdminLayout><AttendanceManagement /></AdminLayout>} />
          <Route path="/admin/students" element={<AdminLayout><StudentManagement /></AdminLayout>} />
          <Route path="/admin/students" element={<AdminLayout><StudentManagement /></AdminLayout>} />
          <Route path="/admin/students/add" element={<AdminLayout><AddStudent /></AdminLayout>} />
          <Route path="/admin/teachers" element={<AdminLayout><TeacherManagement /></AdminLayout>} />
          <Route path="/admin/teachers/add" element={<AdminLayout><AddTeacher /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout><AttendanceReports /></AdminLayout>} />
          <Route path="/admin/billing" element={<AdminLayout><BillingManagement /></AdminLayout>} />
          <Route path="/admin/timetable" element={<AdminLayout><TimetableManagement /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherLayout><TeacherDashboard /></TeacherLayout>} />
          <Route path="/teacher/classes" element={<TeacherLayout><TeacherClasses /></TeacherLayout>} />
          <Route path="/teacher/timetable" element={<TeacherLayout><TeacherTimetable /></TeacherLayout>} />
          <Route path="/teacher/materials" element={<TeacherLayout><TeacherMaterials /></TeacherLayout>} />
          <Route path="/teacher/attendance" element={<TeacherLayout><TeacherAttendance /></TeacherLayout>} />
          <Route path="/teacher/exams" element={<TeacherLayout><TeacherExams /></TeacherLayout>} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
          <Route path="/student/timetable" element={<StudentLayout><StudentTimetable /></StudentLayout>} />
          <Route path="/student/results" element={<StudentLayout><StudentResults /></StudentLayout>} />
          <Route path="/student/fees" element={<StudentLayout><StudentFees /></StudentLayout>} />
          <Route path="/student/materials" element={<StudentLayout><StudentMaterials /></StudentLayout>} />
          <Route path="/student/profile" element={<StudentLayout><StudentProfile /></StudentLayout>} />

          {/* Parent Routes */}
          <Route path="/parent/dashboard" element={<ParentLayout><ParentDashboard /></ParentLayout>} />
          <Route path="/parent/calendar" element={<ParentLayout><ParentCalendar /></ParentLayout>} />
          <Route path="/parent/children" element={<ParentLayout><ParentChildren /></ParentLayout>} />
          <Route path="/parent/fees" element={<ParentLayout><ParentFees /></ParentLayout>} />
          <Route path="/parent/settings" element={<ParentLayout><ParentSettings /></ParentLayout>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
