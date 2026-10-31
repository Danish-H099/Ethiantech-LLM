import { Navigate, Outlet } from "react-router-dom";
import { isTutorAuthed } from "src/utils/authMock";

/**
 * Guards every /tutor/* route behind instructor authentication only.
 **/
export default function TutorRouteGuard() {
  const authed = isTutorAuthed();

  if (!authed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
