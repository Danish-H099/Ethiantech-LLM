import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "src/pages/public/HomePage";
import CourseListPage from "src/pages/public/CourseListPage";
import CourseDetailsPage from "src/pages/public/CourseDetailsPage";
import TutorLayout from "src/components/tutor/TutorLayout";
import AdminLayout from "src/components/admin/AdminLayout";
import StudentLayout from "src/components/student/StudentLayout";
import RouteLoader from "src/components/ui/RouteLoader";
import { Toaster } from "sonner";
import "src/App.css";

// Learning player + all authenticated app pages stay lazy (route-level code splitting).
const AddCoursePage = lazy(() => import("src/pages/tutor/AddCoursePage"));
const TutorDashboardPage = lazy(() => import("src/pages/tutor/TutorDashboardPage"));
const TutorCoursesPage = lazy(() => import("src/pages/tutor/TutorCoursesPage"));
const StudentsEnrolledPage = lazy(() => import("src/pages/tutor/StudentsEnrolledPage"));
const AdminDashboardPage = lazy(() => import("src/pages/admin/AdminDashboardPage"));
const AdminRevenuePage = lazy(() => import("src/pages/admin/AdminRevenuePage"));
const AdminStudentsPage = lazy(() => import("src/pages/admin/AdminStudentsPage"));
const AdminInstructorsPage = lazy(() => import("src/pages/admin/AdminInstructorsPage"));
const AdminCoursesPage = lazy(() => import("src/pages/admin/AdminCoursesPage"));
const AdminUsersPage = lazy(() => import("src/pages/admin/AdminUsersPage"));
const StudentDashboardPage = lazy(() => import("src/pages/student/StudentDashboardPage"));
const StudentMyCoursesPage = lazy(() => import("src/pages/student/StudentMyCoursesPage"));
const StudentCourseOverviewPage = lazy(() => import("src/pages/student/StudentCourseOverviewPage"));
const StudentLessonPlayerPage = lazy(() => import("src/pages/student/StudentLessonPlayerPage"));
const StudentTasksPage = lazy(() => import("src/pages/student/StudentTasksPage"));
const StudentGradesPage = lazy(() => import("src/pages/student/StudentGradesPage"));
const StudentCourseGradesPage = lazy(() => import("src/pages/student/StudentCourseGradesPage"));
const StudentAnalyticsPage = lazy(() => import("src/pages/student/StudentAnalyticsPage"));
const StudentWishlistPage = lazy(() => import("src/pages/student/StudentWishlistPage"));
const StudentNotesPage = lazy(() => import("src/pages/student/StudentNotesPage"));
const StudentProfilePage = lazy(() => import("src/pages/student/StudentProfilePage"));
const StudentNotificationsPage = lazy(() => import("src/pages/student/StudentNotificationsPage"));

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
        <Route path="/tutor" element={<TutorLayout />}>
          <Route index element={<Navigate to="add-course" replace />} />
          <Route path="dashboard" element={<TutorDashboardPage />} />
          <Route path="add-course" element={<AddCoursePage />} />
          <Route path="courses" element={<TutorCoursesPage />} />
          <Route path="students" element={<StudentsEnrolledPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="revenue" element={<AdminRevenuePage />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="instructors" element={<AdminInstructorsPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="my-courses" element={<StudentMyCoursesPage />} />
          <Route path="course/:courseId" element={<StudentCourseOverviewPage />} />
          <Route path="course/:courseId/play" element={<StudentLessonPlayerPage />} />
           <Route path="tasks" element={<StudentTasksPage />} />
          <Route path="grades" element={<StudentGradesPage />} />
          <Route path="grades/:courseId" element={<StudentCourseGradesPage />} />
          <Route path="analytics" element={<StudentAnalyticsPage />} />
          <Route path="wishlist" element={<StudentWishlistPage />} />
          <Route path="notes" element={<StudentNotesPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="notifications" element={<StudentNotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
