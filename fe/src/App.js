// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/common/NavigationBar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TestManagement from './pages/teacher/TestManagement';
import StudentDashboard from './pages/student/StudentDashboard';
import ClassEnrollment from './pages/student/ClassEnrollment';
import ClassTests from './pages/student/ClassTests'; // Imported ClassTests
import TestTaking from './pages/student/TestTaking';
import PerformanceReports from './pages/student/PerformanceReports';
import ParentDashboard from './pages/parent/ParentDashboard';
import ChildPerformance from './pages/parent/ChildPerformance';
import ReportCard from './pages/parent/ReportCard';
import FeedbackPage from './pages/common/FeedbackPage';
import NotFound from './pages/NotFound';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <NavigationBar />
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/class/:class_id/tests" element={<TestManagement />} />
            <Route path="/teacher/feedback" element={<FeedbackPage role="Teacher" />} />
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/enroll" element={<ClassEnrollment />} />
            <Route path="/student/class/:class_id/tests" element={<ClassTests />} />
            <Route path="/student/class/:class_id/test/:test_id" element={<TestTaking />} />
            <Route path="/student/performance" element={<PerformanceReports />} />
            <Route path="/student/feedback" element={<FeedbackPage role="Student" />} />
            {/* Parent Routes */}
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route
              path="/parent/child/:student_id/performance"
              element={<ChildPerformance />}
            />
            <Route
              path="/parent/child/:student_id/report-card"
              element={<ReportCard />}
            />
            <Route path="/parent/feedback" element={<FeedbackPage role="Parent" />} />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
