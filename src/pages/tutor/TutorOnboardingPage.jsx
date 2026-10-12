import { useNavigate } from "react-router-dom";
import OnboardingShell from "src/components/tutor/onboarding/OnboardingShell";

const STEPS = ["Teaching Track", "Profile", "Credentials", "Declarations"];

export default function TutorOnboardingPage() {
  const navigate = useNavigate();

  return (
    <OnboardingShell
      heading="Become an EthianTech instructor"
      subheading="Four short steps: pick your teaching track, tell students who you are, verify your credentials, and confirm your declarations. You can save and come back any time."
      steps={STEPS}
      activeStep={1}
      headerAction={
        <button
          type="button"
          onClick={() => navigate("/tutor/onboarding/status")}
          className="btn-outline rounded-lg px-4 py-2 text-sm-fluid"
        >
          Save &amp; Exit
        </button>
      }
    >
      <section className="card mt-8 p-6 sm:p-8">
        <h2 className="detail-section-title">Step 1 — Choose your teaching track</h2>
        <p className="mt-2 text-sm-fluid text-ink-muted">
          Your track decides which credentials we verify and which publishing
          privileges you unlock. You can review this choice with your
          application before submitting.
        </p>
      </section>
    </OnboardingShell>
  );
}
