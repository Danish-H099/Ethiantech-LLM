import { FieldError, FileDropzone, ToggleChips } from "src/components/tutor/onboarding/wizardFields";
import {
  FIELD_HINT,
  FIELD_INPUT,
  FIELD_LABEL,
} from "src/components/tutor/onboarding/wizardFieldMeta";
import { TUTOR_TIERS } from "src/services/stores/tutorOnboarding";

const SUBJECT_DOMAINS = [
  "Web Development",
  "AI & ML",
  "Data Science",
  "Design",
  "Business",
  "Mobile Dev",
  "Cloud Computing",
  "Marketing",
  "Healthcare",
  "Finance",
  "Legal Studies",
  "Education",
];

/** Step 2 — public instructor profile: photo, headline, bio, subjects, experience, CV. */
export default function StepProfile({
  tier,
  profile,
  photoPreview,
  onPhotoSelect,
  onPhotoClear,
  onChange,
  errors,
}) {
  const requiresDocs = tier !== TUTOR_TIERS.STANDARD;

  function handleSubjectToggle(subject) {
    const subjects = profile.subjects.includes(subject)
      ? profile.subjects.filter((s) => s !== subject)
      : [...profile.subjects, subject];
    onChange({ subjects });
  }

  return (
    <div className="space-y-5">
      <section className="card p-6">
        <h2 className="text-body-lg font-semibold text-ink">Profile photo</h2>
        <p className={FIELD_HINT}>
          A clear headshot on a plain background is the biggest student trust signal
          on a course page.
        </p>
        <div className="mt-3 max-w-sm">
          <FileDropzone
            id="tutor-photo"
            accept="image/*"
            label="Click or drag a photo here"
            hint="JPG or PNG, at least 400×400 px."
            fileName={profile.photoName}
            previewUrl={photoPreview}
            onFile={onPhotoSelect}
            onClear={onPhotoClear}
            error={errors.photo}
          />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-body-lg font-semibold text-ink">Teaching background</h2>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={FIELD_LABEL} htmlFor="tutor-full-name">
              Full name
            </label>
            <input
              id="tutor-full-name"
              type="text"
              value={profile.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. Amina Bekele"
              className={`${FIELD_INPUT} ${errors.fullName ? "border-error" : ""}`}
            />
            <FieldError>{errors.fullName}</FieldError>
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="tutor-experience">
              Years of experience
            </label>
            <input
              id="tutor-experience"
              type="number"
              min="0"
              max="60"
              value={profile.experienceYears}
              onChange={(e) => onChange({ experienceYears: e.target.value })}
              placeholder="e.g. 8"
              className={`${FIELD_INPUT} ${errors.experienceYears ? "border-error" : ""}`}
            />
            <FieldError>{errors.experienceYears}</FieldError>
          </div>
        </div>

        <div className="mt-5">
          <label className={FIELD_LABEL} htmlFor="tutor-headline">
            Headline
          </label>
          <input
            id="tutor-headline"
            type="text"
            value={profile.headline}
            onChange={(e) => onChange({ headline: e.target.value })}
            placeholder="e.g. Senior Cloud Architect with 10+ years of hands-on experience"
            className={`${FIELD_INPUT} ${errors.headline ? "border-error" : ""}`}
          />
          <FieldError>{errors.headline}</FieldError>
        </div>

        <div className="mt-5">
          <label className={FIELD_LABEL} htmlFor="tutor-bio">
            Bio
          </label>
          <textarea
            id="tutor-bio"
            rows={4}
            value={profile.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            placeholder="What do you teach, and what practical experience do you bring to it?"
            className={`input resize-none py-2.5 ${errors.bio ? "border-error" : ""}`}
          />
          <div className="flex items-start justify-between gap-3">
            <FieldError>{errors.bio}</FieldError>
            <p className="ml-auto mt-1 shrink-0 text-sm-fluid text-ink-muted">
              {profile.bio.trim().length} / 40 minimum
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className={FIELD_LABEL}>Subjects you'll teach</p>
          <ToggleChips
            options={SUBJECT_DOMAINS}
            selected={profile.subjects}
            onToggle={handleSubjectToggle}
          />
          <FieldError>{errors.subjects}</FieldError>
        </div>

        <div className="mt-5">
          <label className={FIELD_LABEL} htmlFor="tutor-past-orgs">
            Past institutions or companies{" "}
            <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="tutor-past-orgs"
            type="text"
            value={profile.pastOrgs}
            onChange={(e) => onChange({ pastOrgs: e.target.value })}
            placeholder="e.g. Addis Software, University of Nairobi"
            className={FIELD_INPUT}
          />
        </div>

        <div className="mt-5">
          <p className={FIELD_LABEL}>
            CV / résumé{" "}
            {!requiresDocs && (
              <span className="font-normal text-ink-muted">(optional)</span>
            )}
          </p>
          <FileDropzone
            id="tutor-cv"
            accept=".pdf,.doc,.docx"
            label="Click or drag your CV here"
            hint={
              requiresDocs
                ? "PDF or DOCX — required for the Verified & Institutional tracks."
                : "PDF or DOCX — optional on the Standard track, but it speeds up review."
            }
            fileName={profile.cvName}
            onFile={(file) => onChange({ cvName: file.name })}
            onClear={() => onChange({ cvName: "" })}
            error={errors.cv}
          />
        </div>
      </section>
    </div>
  );
}
