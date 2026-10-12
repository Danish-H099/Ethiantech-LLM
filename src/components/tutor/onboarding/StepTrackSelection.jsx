import { m as Motion, useReducedMotion } from "motion/react";
import { BadgeCheck, Building2, Check, ShieldCheck, UserRound } from "lucide-react";
import { createCardHover } from "src/lib/animationVariants";
import { FieldError } from "src/components/tutor/onboarding/wizardFields";
import { TIER_META } from "src/components/tutor/onboarding/wizardFieldMeta";

const TRACKS = [
  {
    id: "standard",
    Icon: UserRound,
    tagline: "For independent educators sharing foundational skills.",
    needs: [
      "Profile photo, bio & teaching subjects",
      "Declared industry experience",
      "No documents required",
    ],
    unlocks: [
      "Publish free courses",
      "Host community workshops",
      "Upgrade to Verified any time",
    ],
  },
  {
    id: "verified",
    Icon: BadgeCheck,
    recommended: true,
    tagline: "For experienced professionals monetizing their expertise.",
    needs: [
      "Everything in Standard",
      "Government-issued ID verification",
      "Degree or professional certifications",
      "CV / résumé",
    ],
    unlocks: [
      "Blue Verified Instructor badge",
      "Publish paid courses",
      "Priority catalog listing",
    ],
  },
  {
    id: "institutional",
    Icon: Building2,
    tagline: "For universities, bootcamps & corporate training teams.",
    needs: [
      "Everything in Verified",
      "Organization affiliation proof",
      "Institutional or business details",
      "Professional license validation",
    ],
    unlocks: [
      "Gold Institutional Partner badge",
      "Enterprise & multi-seat licensing",
      "Institutional catalog inclusion",
    ],
  },
];

function TrackCard({ track, selected, onSelect }) {
  const reduced = useReducedMotion();
  const meta = TIER_META[track.id];
  const { Icon } = track;

  return (
    <Motion.div
      variants={createCardHover(reduced)}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      className={`relative flex h-full flex-col rounded-xl border p-5 transition-colors ${selected
          ? "border-accent-tutor bg-tint-tutor ring-2 ring-accent-tutor"
          : "border-border bg-white"
        }`}
    >
      <span
        aria-hidden="true"
        className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full transition ${selected
            ? "bg-accent-tutor text-white"
            : "border border-border bg-white text-transparent"
          }`}
      >
        <Check size={14} strokeWidth={3} />
      </span>

      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-tint-tutor text-accent-tutor">
        <Icon size={22} />
      </span>

      <span className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-body-lg font-semibold text-ink">{meta.name}</span>
        {track.recommended && (
          <span className="badge bg-tint-tutor text-xs font-semibold text-brand-secondary-strong">
            Recommended
          </span>
        )}
      </span>
      <span className="mt-1 block text-sm-fluid text-ink-muted">{track.tagline}</span>

      <span className="mt-4 block text-sm-fluid font-semibold text-ink">You'll need</span>
      <ul className="mt-2 space-y-1.5">
        {track.needs.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm-fluid text-ink-muted">
            <Check size={15} className="mt-0.5 shrink-0 text-ink-muted/60" />
            {item}
          </li>
        ))}
      </ul>

      <span className="mt-4 block text-sm-fluid font-semibold text-ink">You'll unlock</span>
      <ul className="mt-2 space-y-1.5">
        {track.unlocks.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm-fluid text-ink">
            <Check size={15} className="mt-0.5 shrink-0 text-accent-tutor" />
            {item}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onSelect(track.id)}
        aria-pressed={selected}
        aria-label={`Select ${meta.name}`}
        className="absolute inset-0 rounded-xl"
      />
    </Motion.div>
  );
}

/** Step 1 — pick the teaching track that decides which credentials get verified. */
export default function StepTrackSelection({ tier, onSelect, error }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {TRACKS.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            selected={tier === track.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <FieldError>{error}</FieldError>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-surface-soft p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-accent-tutor" />
        <p className="text-sm-fluid text-ink-muted">
          Every application — Standard, Verified, or Institutional — joins the same
          Trust &amp; Safety review queue (usually 24-48 hours). While you wait you
          can draft courses in Sandbox Mode; publishing unlocks once you're approved.
        </p>
      </div>
    </div>
  );
}
