import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

const HomePage = lazy(() => import("./components/HomePage"));
const CourseListPage = lazy(() => import("./components/CourseListPage"));
const CourseDetailsPage = lazy(() => import("./components/CourseDetailsPage"));
const TutorLayout = lazy(() => import("./components/tutor/TutorLayout"));
const AddCoursePage = lazy(() => import("./components/tutor/AddCoursePage"));
const TutorDashboardPage = lazy(() => import("./components/tutor/TutorDashboardPage"));
const TutorCoursesPage = lazy(() => import("./components/tutor/TutorCoursesPage"));
const StudentsEnrolledPage = lazy(() => import("./components/tutor/StudentsEnrolledPage"));
const CourseVideo = lazy(() => import("./components/CourseVideo"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboardPage = lazy(() => import("./components/admin/AdminDashboardPage"));
const AdminRevenuePage = lazy(() => import("./components/admin/AdminRevenuePage"));
const AdminStudentsPage = lazy(() => import("./components/admin/AdminStudentsPage"));
const AdminInstructorsPage = lazy(() => import("./components/admin/AdminInstructorsPage"));
const AdminCoursesPage = lazy(() => import("./components/admin/AdminCoursesPage"));
const AdminUsersPage = lazy(() => import("./components/admin/AdminUsersPage"));
const StudentLayout = lazy(() => import("./components/student/StudentLayout"));
const StudentDashboardPage = lazy(() => import("./components/student/StudentDashboardPage"));
const StudentMyCoursesPage = lazy(() => import("./components/student/StudentMyCoursesPage"));
const StudentNotesPage = lazy(() => import("./components/student/StudentNotesPage"));
const StudentWishlistPage = lazy(() => import("./components/student/StudentWishlistPage"));
const StudentPerformancePage = lazy(() => import("./components/student/StudentPerformancePage"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/video" element={<CourseVideo />} />
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
            <Route path="notes" element={<StudentNotesPage />} />
            <Route path="wishlist" element={<StudentWishlistPage />} />
            <Route path="performance" element={<StudentPerformancePage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
