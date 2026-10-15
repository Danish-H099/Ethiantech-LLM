import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Check, Clock, Lock } from "lucide-react";
import OnboardingShell from "src/components/tutor/onboarding/OnboardingShell";
import {
  getTutorOnboardingState,
  TUTOR_STATUS,
} from "src/services/stores/tutorOnboarding";

const STATUS_META = {
  [TUTOR_STATUS.NOT_STARTED]: {
    badge: "badge-status-not-started",
    badgeLabel: "Not started",
    heading: "Start your instructor application",
    body: "Pick a teaching track, add your profile and credentials, and submit for verification. It usually takes under 10 minutes.",
    action: { label: "Start Application", to: "/tutor/onboarding" },
  },
  [TUTOR_STATUS.IN_PROGRESS]: {
    badge: "badge-status-drafting",
    badgeLabel: "In progress",
    heading: "Finish your application",
    body: "Your draft is saved. Pick up where you left off and submit it for verification when you're ready.",
    action: { label: "Continue Application", to: "/tutor/onboarding" },
  },
  [TUTOR_STATUS.SUBMITTED]: {
    badge: "badge-status-submitted",
    badgeLabel: "Under review",
    heading: "Verification in progress",
    body: "Our Trust & Safety team is reviewing your application — this usually takes 24–48 hours. Meanwhile you can draft courses in Sandbox Mode; publishing unlocks once you're approved.",
    action: { label: "Enter Course Sandbox", to: "/tutor/add-course" },
  },
  [TUTOR_STATUS.APPROVED]: {
    badge: "badge-status-completed",
    badgeLabel: "Approved",
    heading: "You're a verified instructor",
    body: "Your application passed review. Publish courses, enroll students, and set up payouts from your dashboard.",
    action: { label: "Go to Dashboard", to: "/tutor/dashboard" },
  },
  [TUTOR_STATUS.REJECTED]: {
    badge: "bg-error-soft text-error",
    badgeLabel: "Changes requested",
    heading: "We need a few changes",
    body: "Your application needs revisions before it can be approved. Update your details and resubmit for review.",
    action: { label: "Edit Application", to: "/tutor/onboarding" },
  },
};

/** Review checklist shown on the status hub, derived from the current status. */
function buildTimeline(status) {
  const submitted = [TUTOR_STATUS.SUBMITTED, TUTOR_STATUS.APPROVED, TUTOR_STATUS.REJECTED].includes(status);
  const reviewed = [TUTOR_STATUS.APPROVED, TUTOR_STATUS.REJECTED].includes(status);
  const approved = status === TUTOR_STATUS.APPROVED;
  return [
    { label: "Account created", state: "done" },
    {
      label: submitted ? "Profile & credentials submitted" : "Submit profile & credentials",
      state: submitted ? "done" : "active",
    },
    {
      label: reviewed
        ? approved
          ? "Application approved"
          : "Review complete — changes requested"
        : "Admin review (usually 24–48 hours)",
      state: reviewed ? (approved ? "done" : "active") : submitted ? "active" : "idle",
    },
    {
      label: approved ? "Publishing & payouts unlocked" : "Publishing & payouts",
      state: approved ? "done" : "idle",
    },
  ];
}

export default function TutorOnboardingStatusPage() {
  const navigate = useNavigate();
  const { status, tier, submittedAt, reviewNote } = getTutorOnboardingState();
  const meta = STATUS_META[status] ?? STATUS_META[TUTOR_STATUS.NOT_STARTED];
  const submittedLabel = submittedAt
    ? new Date(submittedAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <OnboardingShell
      heading="Application status"
      subheading="Track your instructor verification and jump back into your application whenever you need to."
      headerAction={
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-outline rounded-lg px-4 py-2 text-sm-fluid"
        >
          Back
        </button>
      }
    >
      <section className="card mt-8 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`badge ${meta.badge}`}>{meta.badgeLabel}</span>
          {tier && (
            <span className="badge badge-status-not-started">
              Track: <span className="ml-1 font-semibold capitalize">{tier}</span>
            </span>
          )}
        </div>

        <h2 className="mt-4 detail-section-title">{meta.heading}</h2>
        <p className="mt-2 text-sm-fluid text-ink-muted">{meta.body}</p>
        {submittedLabel && (
          <p className="mt-3 text-sm-fluid text-ink-muted">Submitted on {submittedLabel}</p>
        )}

        {status === TUTOR_STATUS.REJECTED && reviewNote && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-error/40 bg-error-soft p-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-error" />
            <div>
              <p className="text-sm-fluid font-semibold text-ink">Reviewer note</p>
              <p className="mt-1 text-sm-fluid text-ink-muted">{reviewNote}</p>
            </div>
          </div>
        )}

        <ol className="mt-6 space-y-3 border-t border-border pt-6">
          {buildTimeline(status).map((item) => (
            <li key={item.label} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  item.state === "done"
                    ? "bg-success-soft text-success"
                    : item.state === "active"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-surface-soft text-ink-muted"
                }`}
              >
                {item.state === "done" ? (
                  <Check size={14} strokeWidth={3} />
                ) : item.state === "active" ? (
                  <Clock size={14} />
                ) : (
                  <Lock size={13} />
                )}
              </span>
              <span
                className={`text-sm-fluid ${
                  item.state === "idle" ? "text-ink-muted" : "font-medium text-ink"
                }`}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={meta.action.to} className="btn-brand rounded-lg px-5 py-2.5 text-sm-fluid">
            {meta.action.label}
          </Link>
          <a
            href="mailto:info@ethiantech.com?subject=Instructor%20verification%20support"
            className="btn-outline rounded-lg px-5 py-2.5 text-sm-fluid"
          >
            Contact Verification Support
          </a>
        </div>
      </section>
    </OnboardingShell>
  );
}
