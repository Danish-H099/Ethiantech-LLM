import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isTutorAuthed } from "src/utils/authMock";
import { syncTutorApproval } from "src/services/tutorProfile";
import RouteLoader from "src/components/ui/RouteLoader";

/**
 * Guards every /tutor/* route behind instructor authentication only.
 *
 * Onboarding status (not_started, in_progress, submitted, approved, rejected)
 * no longer blocks access to the tutor workspace — tutors can freely browse
 * the app at any stage and complete or redo onboarding from the profile page.
 *
 * On every reload this also refreshes the stored `tutor.approved` flag from the
 * API, so an admin's decision takes effect on the tutor's next page load
 * without requiring a fresh login.
 */
export default function TutorRouteGuard() {
  const authed = isTutorAuthed();
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    let active = true;
    syncTutorApproval().finally(() => {
      if (active) setSyncing(false);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!authed) {
    return <Navigate to="/" replace />;
  }

  if (syncing) {
    return <RouteLoader />;
  }

  return <Outlet />;
}
