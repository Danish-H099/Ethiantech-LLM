import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isTutorAuthed } from "src/utils/authMock";
import {
  getTutorOnboardingState,
  TUTOR_STATUS,
} from "src/services/stores/tutorOnboarding";

// Onboarding surface routes reachable at each application status:
// - /tutor/onboarding          the 4-step wizard itself.
// - /tutor/onboarding/status   the application status hub.
// - /tutor/add-course          the sandbox course builder, unlocked once the
//                               application is submitted for review.
const WIZARD_PATH = "/tutor/onboarding";
const STATUS_PATH = "/tutor/onboarding/status";
const SANDBOX_PATH = "/tutor/add-course";

function isOnboardingPath(pathname) {
  return pathname === WIZARD_PATH || pathname.startsWith(`${WIZARD_PATH}/`);
}

/**
 * Gates every /tutor/* route behind instructor auth + onboarding status:
 *
 * - Not signed up as a tutor      -> home page.
 * - not_started / in_progress     -> wizard only.
 * - submitted (under review)      -> wizard, status hub, and the add-course
 *                                    sandbox; everything else goes to the
 *                                    status hub.
 * - approved                      -> full access; wizard redirects to dashboard.
 * - rejected                      -> wizard only, so the applicant can revise.
 */
export default function TutorRouteGuard() {
  const location = useLocation();

  if (!isTutorAuthed()) {
    return <Navigate to="/" replace />;
  }

  const { status } = getTutorOnboardingState();
  const pathname = location.pathname;
  const onOnboarding = isOnboardingPath(pathname);

  if (status === TUTOR_STATUS.APPROVED) {
    if (onOnboarding) return <Navigate to="/tutor/dashboard" replace />;
    return <Outlet />;
  }

  if (status === TUTOR_STATUS.SUBMITTED) {
    if (onOnboarding || pathname === SANDBOX_PATH) return <Outlet />;
    return <Navigate to={STATUS_PATH} replace />;
  }

  // not_started / in_progress / rejected — wizard only.
  if (onOnboarding) return <Outlet />;
  return <Navigate to={WIZARD_PATH} replace />;
}
