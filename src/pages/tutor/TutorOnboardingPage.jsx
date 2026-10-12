import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, m as Motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import OnboardingShell from "src/components/tutor/onboarding/OnboardingShell";
import StepTrackSelection from "src/components/tutor/onboarding/StepTrackSelection";
import StepProfile from "src/components/tutor/onboarding/StepProfile";
import StepCredentials from "src/components/tutor/onboarding/StepCredentials";
import StepDeclarations from "src/components/tutor/onboarding/StepDeclarations";
import { buttonPress, slideUp } from "src/lib/animationVariants";
import {
  getTutorOnboardingState,
  saveTutorOnboardingStep,
  submitTutorOnboarding,
  TUTOR_TIERS,
} from "src/services/stores/tutorOnboarding";

const STEPS = ["Teaching Track", "Profile", "Credentials", "Declarations"];

const STEP_COPY = [
  {
    heading: "Choose your teaching track",
    subheading:
      "Your track decides which credentials we verify and which publishing privileges you unlock. You can review this choice before submitting.",
  },
  {
    heading: "Tell students who you are",
    subheading:
      "A clear photo and a specific bio are the biggest trust signals on a course page. You can refine all of this later.",
  },
  {
    heading: "Verify your credentials",
    subheading:
      "Documents are reviewed by our Trust & Safety team and never shown publicly. Only the fields relevant to your track are required.",
  },
  {
    heading: "Declarations & final review",
    subheading:
      "Confirm your declarations and submit — our team usually completes verification within 24–48 hours.",
  },
];

const DECLARATION_KEYS = ["accuracy", "quality", "conduct"];

const emptyOrganization = () => ({ name: "", website: "", email: "", authFileName: "" });

function isInstitutionalTier(tierValue) {
  return tierValue === TUTOR_TIERS.INSTITUTIONAL;
}

/** First step that still needs work, so returning applicants skip ahead. */
function firstIncompleteStep(state) {
  if (!state.tier) return 1;
  const p = state.profile ?? {};
  if (!p.fullName || !p.headline || !p.bio || !p.photoName) return 2;
  if (state.tier !== TUTOR_TIERS.STANDARD) {
    const v = state.verification ?? {};
    const hasIdentity = Boolean(v.idType && v.idFileName);
    const hasCredentials =
      (v.degrees?.length ?? 0) > 0 || (v.certifications?.length ?? 0) > 0;
    const hasOrganization =
      state.tier !== TUTOR_TIERS.INSTITUTIONAL || Boolean(v.organization?.name);
    if (!hasIdentity || !hasCredentials || !hasOrganization) return 3;
  }
  return 4;
}

function trimErrors(errors, keys) {
  const next = { ...errors };
  keys.forEach((key) => delete next[key]);
  return next;
}

/**
 * 4-step instructor onboarding wizard: track selection → profile → tier-specific
 * credentials → declarations. Each completed step is persisted through the
 * onboarding store; the last step submits the application for admin review.
 */
export default function TutorOnboardingPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const [saved] = useState(getTutorOnboardingState);
  const [step, setStep] = useState(() => firstIncompleteStep(saved));
  const [tier, setTier] = useState(saved.tier);
  const [profile, setProfile] = useState(() => ({
    fullName: "",
    headline: "",
    bio: "",
    photoName: "",
    subjects: [],
    experienceYears: "",
    pastOrgs: "",
    cvName: "",
    ...saved.profile,
  }));
  const [verification, setVerification] = useState(() => {
    const savedV = saved.verification ?? {};
    return {
      idType: "",
      idFileName: "",
      notes: "",
      ...savedV,
      degrees: Array.isArray(savedV.degrees) ? savedV.degrees : [],
      certifications: Array.isArray(savedV.certifications) ? savedV.certifications : [],
      organization: { ...emptyOrganization(), ...(savedV.organization ?? {}) },
    };
  });
  const [declarations, setDeclarations] = useState(() => {
    const accepted = saved.declarationsAccepted === true;
    return { accuracy: accepted, quality: accepted, conduct: accepted };
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const requiresDocs = tier !== TUTOR_TIERS.STANDARD;
  const stepCopy = STEP_COPY[step - 1];
  const stepVariants = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : slideUp;

  function updateProfile(patch) {
    setProfile((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => trimErrors(prev, Object.keys(patch)));
  }

  function updateVerification(patch) {
    setVerification((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => trimErrors(prev, Object.keys(patch)));
  }

  function handlePhotoSelect(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setProfile((prev) => ({ ...prev, photoName: file.name }));
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
    setErrors((prev) => trimErrors(prev, ["photo"]));
  }

  function handlePhotoClear() {
    setProfile((prev) => ({ ...prev, photoName: "" }));
    setPhotoPreview(null);
  }

  function handleTierSelect(tierId) {
    setTier(tierId);
    setErrors((prev) => trimErrors(prev, ["tier"]));
  }

  function validateStep(current) {
    const errs = {};
    if (current === 1 && !tier) {
      errs.tier = "Choose a teaching track to continue.";
    }
    if (current === 2) {
      if (!profile.photoName) errs.photo = "Add a profile photo.";
      if (!profile.fullName.trim()) errs.fullName = "Enter your full name.";
      if (!profile.headline.trim()) errs.headline = "Add a headline for your profile.";
      if (profile.bio.trim().length < 40) {
        errs.bio = "Write at least 40 characters so students can get to know you.";
      }
      if (profile.subjects.length === 0) {
        errs.subjects = "Pick at least one subject you'll teach.";
      }
      const years = Number(profile.experienceYears);
      if (
        profile.experienceYears === "" ||
        Number.isNaN(years) ||
        years < 0 ||
        years > 60
      ) {
        errs.experienceYears = "Enter your years of experience (0–60).";
      }
      if (requiresDocs && !profile.cvName) {
        errs.cv = "A CV / résumé is required for the Verified & Institutional tracks.";
      }
    }
    if (current === 3) {
      verification.degrees.forEach((degree, index) => {
        if (!degree.institution.trim() || !degree.qualification.trim()) {
          errs[`degree-${index}`] = "Institution and qualification are required.";
        }
      });
      verification.certifications.forEach((cert, index) => {
        if (!cert.name.trim() || !cert.issuer.trim()) {
          errs[`cert-${index}`] = "Certification name and issuing body are required.";
        }
      });
      if (requiresDocs) {
        if (!verification.idType) errs.idType = "Select your document type.";
        if (!verification.idFileName) errs.idFile = "Upload your government-issued ID.";
        if (verification.degrees.length === 0 && verification.certifications.length === 0) {
          errs.credentials =
            "Add at least one degree or professional certification for this track.";
        }
        if (isInstitutionalTier(tier)) {
          const org = verification.organization;
          if (!org.name.trim()) errs.orgName = "Enter your organization's name.";
          if (!org.website.trim()) errs.orgWebsite = "Enter your organization's website.";
          if (!org.email.trim()) {
            errs.orgEmail = "Enter an institutional email address.";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(org.email.trim())) {
            errs.orgEmail = "Enter a valid email address.";
          }
          if (!org.authFileName) {
            errs.orgAuth = "Upload a proof-of-affiliation or authorization letter.";
          }
        }
      }
    }
    if (current === 4) {
      const allAccepted = DECLARATION_KEYS.every((key) => declarations[key]);
      if (!allAccepted) {
        errs.declarations = "Accept all three declarations to submit your application.";
      }
    }
    return errs;
  }

  function persistStep(current) {
    if (current === 1) saveTutorOnboardingStep({ tier });
    else if (current === 2) saveTutorOnboardingStep({ profile });
    else if (current === 3) saveTutorOnboardingStep({ verification });
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function handleContinue() {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    persistStep(step);
    if (step < STEPS.length) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }
    submitTutorOnboarding({
      tier,
      profile,
      verification,
      declarationsAccepted: DECLARATION_KEYS.every((key) => declarations[key]),
    });
    navigate("/tutor/onboarding/status");
  }

  function handleSaveAndExit() {
    persistStep(step);
    navigate("/tutor/onboarding/status");
  }

  return (
    <OnboardingShell
      heading={stepCopy.heading}
      subheading={stepCopy.subheading}
      steps={STEPS}
      activeStep={step}
      headerAction={
        <button
          type="button"
          onClick={handleSaveAndExit}
          className="btn-outline rounded-lg px-4 py-2 text-sm-fluid"
        >
          Save &amp; Exit
        </button>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <Motion.div
          key={step}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mt-8"
        >
          {step === 1 && (
            <StepTrackSelection
              tier={tier}
              onSelect={handleTierSelect}
              error={errors.tier}
            />
          )}
          {step === 2 && (
            <StepProfile
              tier={tier}
              profile={profile}
              photoPreview={photoPreview}
              onPhotoSelect={handlePhotoSelect}
              onPhotoClear={handlePhotoClear}
              onChange={updateProfile}
              errors={errors}
            />
          )}
          {step === 3 && (
            <StepCredentials
              tier={tier}
              verification={verification}
              onChange={updateVerification}
              errors={errors}
            />
          )}
          {step === 4 && (
            <StepDeclarations
              tier={tier}
              profile={profile}
              declarations={declarations}
              onChange={(patch) => {
                setDeclarations((prev) => ({ ...prev, ...patch }));
                setErrors((prev) => trimErrors(prev, ["declarations"]));
              }}
              error={errors.declarations}
            />
          )}
        </Motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className="btn-outline rounded-lg px-5 py-2.5 text-sm-fluid"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <Motion.button
          type="button"
          onClick={handleContinue}
          variants={buttonPress}
          whileTap="tap"
          className="btn-brand rounded-lg px-6 py-2.5 text-sm-fluid"
        >
          {step === STEPS.length ? "Submit for Verification" : "Save & Continue"}
          <ArrowRight size={16} />
        </Motion.button>
      </div>
    </OnboardingShell>
  );
}

