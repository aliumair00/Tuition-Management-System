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
import TeacherSettings from './pages/teacher/TeacherSettings';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentResults from './pages/student/StudentResults';
import StudentFees from './pages/student/StudentFees';
import StudentMaterials from './pages/student/StudentMaterials';
import StudentProfile from './pages/student/StudentProfile';
import ParentCalendar from './pages/parent/ParentCalendar';
import ParentChildren from './pages/parent/ParentChildren';
import ParentFees from './pages/parent/ParentFees';
import ParentSettings from './pages/parent/ParentSettings';
import ProtectedRoute from './components/ProtectedRoute';
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
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Routes>
                <Route path="dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="classes" element={<AdminLayout><ClassManagement /></AdminLayout>} />
                <Route path="subjects" element={<AdminLayout><SubjectManagement /></AdminLayout>} />
                <Route path="attendance" element={<AdminLayout><AttendanceManagement /></AdminLayout>} />
                <Route path="students" element={<AdminLayout><StudentManagement /></AdminLayout>} />
                <Route path="students/add" element={<AdminLayout><AddStudent /></AdminLayout>} />
                <Route path="teachers" element={<AdminLayout><TeacherManagement /></AdminLayout>} />
                <Route path="teachers/add" element={<AdminLayout><AddTeacher /></AdminLayout>} />
                <Route path="reports" element={<AdminLayout><AttendanceReports /></AdminLayout>} />
                <Route path="billing" element={<AdminLayout><BillingManagement /></AdminLayout>} />
                <Route path="timetable" element={<AdminLayout><TimetableManagement /></AdminLayout>} />
                <Route path="settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Teacher Routes */}
          <Route path="/teacher/*" element={
            <ProtectedRoute allowedRoles={['Teacher']}>
              <Routes>
                <Route path="dashboard" element={<TeacherLayout><TeacherDashboard /></TeacherLayout>} />
                <Route path="classes" element={<TeacherLayout><TeacherClasses /></TeacherLayout>} />
                <Route path="timetable" element={<TeacherLayout><TeacherTimetable /></TeacherLayout>} />
                <Route path="materials" element={<TeacherLayout><TeacherMaterials /></TeacherLayout>} />
                <Route path="attendance" element={<TeacherLayout><TeacherAttendance /></TeacherLayout>} />
                <Route path="exams" element={<TeacherLayout><TeacherExams /></TeacherLayout>} />
                <Route path="settings" element={<TeacherLayout><TeacherSettings /></TeacherLayout>} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <Routes>
                <Route path="dashboard" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
                <Route path="timetable" element={<StudentLayout><StudentTimetable /></StudentLayout>} />
                <Route path="results" element={<StudentLayout><StudentResults /></StudentLayout>} />
                <Route path="fees" element={<StudentLayout><StudentFees /></StudentLayout>} />
                <Route path="materials" element={<StudentLayout><StudentMaterials /></StudentLayout>} />
                <Route path="profile" element={<StudentLayout><StudentProfile /></StudentLayout>} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Parent Routes */}
          <Route path="/parent/*" element={
            <ProtectedRoute allowedRoles={['Parent']}>
              <Routes>
                <Route path="dashboard" element={<ParentLayout><ParentDashboard /></ParentLayout>} />
                <Route path="calendar" element={<ParentLayout><ParentCalendar /></ParentLayout>} />
                <Route path="children" element={<ParentLayout><ParentChildren /></ParentLayout>} />
                <Route path="fees" element={<ParentLayout><ParentFees /></ParentLayout>} />
                <Route path="settings" element={<ParentLayout><ParentSettings /></ParentLayout>} />
              </Routes>
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
