import { ShieldAlert } from "lucide-react";
import { FieldError } from "src/components/tutor/onboarding/wizardFields";
import { TIER_META } from "src/components/tutor/onboarding/wizardFieldMeta";

const DECLARATIONS = [
  {
    key: "accuracy",
    label:
      "I confirm that all credentials, work history, and documents provided are accurate and my own.",
  },
  {
    key: "quality",
    label:
      "I understand that my courses are subject to quality and safety review before they can be published.",
  },
  {
    key: "conduct",
    label:
      "I agree to the EthianTech Instructor Code of Conduct and content policy.",
  },
];

/** Step 4 — application recap, regulated-profession disclaimer, mandatory declarations. */
export default function StepDeclarations({
  tier,
  profile,
  declarations,
  onChange,
  error,
}) {
  const meta = TIER_META[tier] ?? TIER_META.standard;

  return (
    <div className="space-y-5">
      <section className="card p-6">
        <h2 className="text-body-lg font-semibold text-ink">Review your application</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm-fluid text-ink-muted">Teaching track</dt>
            <dd className="mt-1">
              <span className={`badge ${meta.badgeClass}`}>{meta.name}</span>
            </dd>
          </div>
          <div>
            <dt className="text-sm-fluid text-ink-muted">Instructor</dt>
            <dd className="mt-1 text-sm-fluid font-medium text-ink">
              {profile.fullName || "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm-fluid text-ink-muted">Subjects</dt>
            <dd className="mt-1 text-sm-fluid text-ink">
              {profile.subjects.length > 0 ? profile.subjects.join(", ") : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-accent-tutor bg-tint-tutor p-5">
        <h2 className="flex items-center gap-2 text-body-lg font-semibold text-ink">
          <ShieldAlert size={19} className="shrink-0 text-accent-tutor" />
          Verification &amp; regulated professions
        </h2>
        <p className="mt-2 text-sm-fluid text-ink-muted">
          EthianTech verifies the identity of instructors and the authenticity of
          submitted documents. Verification does not constitute an endorsement,
          official accreditation, or grant a state or national professional license
          to practice. If you teach in a regulated domain — such as clinical
          healthcare, financial advising, or legal practice — you must follow your
          jurisdiction's laws and include the relevant educational disclaimers in
          your course content.
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-body-lg font-semibold text-ink">Declarations</h2>
        <div className="mt-4 space-y-3">
          {DECLARATIONS.map((declaration) => (
            <label
              key={declaration.key}
              className="flex cursor-pointer items-start gap-3"
            >
              <input
                type="checkbox"
                checked={declarations[declaration.key]}
                onChange={(e) => onChange({ [declaration.key]: e.target.checked })}
                className="accent-brand mt-1 h-4 w-4 shrink-0"
              />
              <span className="text-sm-fluid text-ink">{declaration.label}</span>
            </label>
          ))}
        </div>
        <FieldError>{error}</FieldError>
        <p className="mt-4 text-sm-fluid text-ink-muted">
          On submit, your application joins the Trust &amp; Safety review queue
          (usually 24–48 hours). You can start drafting your first course in
          Sandbox Mode right away — publishing unlocks once you're approved.
        </p>
      </section>
    </div>
  );
}
