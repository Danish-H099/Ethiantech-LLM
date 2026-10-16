import { Navigate, Outlet } from "react-router-dom";
import { isTutorAuthed } from "src/utils/authMock";

/**
 * Guards every /tutor/* route behind instructor authentication only.
 *
 * Onboarding status (not_started, in_progress, submitted, approved, rejected)
 * no longer blocks access to the tutor workspace — tutors can freely browse
 * the app at any stage and complete or redo onboarding from the profile page.
 */
export default function TutorRouteGuard() {
  if (!isTutorAuthed()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
