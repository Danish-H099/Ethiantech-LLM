import { Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function TutorBanner({ profileComplete, approved }) {
  if (approved === true) return null;

  const linkPath = profileComplete ? "/support" : "/tutor/profile";
  const message = profileComplete
    ? "Profile is submitted. Verification is in progress." 
    : "Complete profile to unlock course publishing";
  const sub = profileComplete
    ? "Your profile is under review. The process usually takes 24–48 hours. Contact support if you need assistance."
    : "Complete your profile to unlock course publishing and payouts. Once submitted, your profile will be under admin review (usually 24–48 hours)."
    ;
  const linkText = profileComplete ? "Contact support" : "Complete your profile";

  return (
    <div className="mb-6 flex flex-wrap items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
      <Info size={18} className="mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm-fluid font-semibold text-amber-800">{message}</p>
        <p className="mt-1 text-sm-fluid text-amber-700">{sub}</p>
      </div>
      <Link
        to={linkPath}
        className="text-sm-fluid font-medium text-amber-800 underline transition hover:text-amber-900"
      >
        {linkText}
      </Link>
    </div>
  );
}
