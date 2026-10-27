import { useState, useEffect } from "react";
import { m as Motion } from "motion/react";
import {
  Pencil,
  FileText,
  Award,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { fadeIn } from "src/lib/animationVariants";
import { fetchMyTutorProfile } from "src/services/tutorProfile";
import TutorProfileForm from "src/components/tutor/TutorProfileForm";

const GENDER_DISPLAY = {
  MALE: "Male",
  FEMALE: "Female",
  NON_BINARY: "Non-binary",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    iconClassName: "text-amber-500",
  },
  approved: {
    icon: CheckCircle2,
    label: "Verified Instructor",
    className: "bg-green-50 text-green-700 border-green-200",
    iconClassName: "text-green-500",
  },
  rejected: {
    icon: XCircle,
    label: "Changes Requested",
    className: "bg-red-50 text-red-700 border-red-200",
    iconClassName: "text-red-500",
  },
};

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StatusBadge({ approved, className = "" }) {
  const status = approved ? "approved" : "pending";
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${config.className} ${className}`}
    >
      <Icon size={14} className={config.iconClassName} aria-hidden="true" />
      {config.label}
    </span>
  );
}

function ProfileHeader({ profile, onEdit }) {
  const avatarUrl = profile.profileImage
    ? `${apiUrl}${profile.profileImage}`
    : null;

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TU";

  return (
    <section className="card overflow-hidden">
      <div className="bg-tint-tutor px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative shrink-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-brand/10 shadow-avatar">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${profile.fullName} avatar`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brand/10 text-2xl font-semibold text-brand">
                  {initials}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1">
              <StatusBadge approved={profile.approved} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="page-title mt-2">{profile.fullName}</h1>
            <p className="mt-1 text-body-lg font-medium text-ink">
              {profile.headline}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-ink-muted">
                {profile.nationality}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-ink-muted">
                {profile.age} years old
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-ink-muted">
                {GENDER_DISPLAY[profile.gender] || profile.gender}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="btn-outline shrink-0 self-end p-3"
          >
            <Pencil size={16} aria-hidden="true" />
            Edit profile
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ about }) {
  return (
    <section className="mt-6 card p-5 sm:p-6" aria-labelledby="about-heading">
      <div className="flex items-center gap-2">
        <FileText size={18} className="text-accent-tutor" aria-hidden="true" />
        <h2 id="about-heading" className="section-title">
          About
        </h2>
      </div>
      <p className="mt-3 text-sm-fluid leading-relaxed text-ink-muted">
        {about?.trim() || "No bio provided yet."}
      </p>
    </section>
  );
}

function CredentialsSection({ resume, certificates }) {
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);
  const hasCertificates = certificates && certificates.length > 0;

  return (
    <section className="mt-6 card p-5 sm:p-6" aria-labelledby="credentials-heading">
      <div className="flex items-center gap-2">
        <Award size={18} className="text-accent-tutor" aria-hidden="true" />
        <h2 id="credentials-heading" className="section-title">
          Credentials
        </h2>
      </div>

      <div className="mt-4 space-y-3">
        {resume && (
          <a
            href={`${apiUrl}${resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border bg-surface-soft p-4 transition hover:border-accent-tutor hover:bg-tint-tutor"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-border">
              <FileText size={18} className="text-accent-tutor" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">Resume</p>
              <p className="text-xs text-ink-muted">PDF / DOCX</p>
            </div>
            <Download size={16} className="shrink-0 text-ink-muted" />
          </a>
        )}

        {hasCertificates && (
          <div className="rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setIsCertificatesOpen(!isCertificatesOpen)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-surface-soft"
              aria-expanded={isCertificatesOpen}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-border">
                  <Award size={18} className="text-brand-secondary-strong" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    Certificates ({certificates.length})
                  </p>
                  <p className="text-xs text-ink-muted">Uploaded credentials</p>
                </div>
              </div>
              {isCertificatesOpen ? (
                <ChevronUp size={18} className="text-ink-muted" />
              ) : (
                <ChevronDown size={18} className="text-ink-muted" />
              )}
            </button>

            {isCertificatesOpen && (
              <div className="border-t border-border p-4 pt-3">
                <div className="space-y-2">
                  {certificates.map((cert) => (
                    <a
                      key={cert.id}
                      href={`${apiUrl}${cert.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border bg-white p-3 transition hover:border-accent-tutor hover:bg-surface-soft"
                    >
                      <FileText size={16} className="shrink-0 text-brand-secondary-strong" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {cert.fileName}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {formatFileSize(cert.fileSize)}
                        </p>
                      </div>
                      <ExternalLink size={14} className="shrink-0 text-ink-muted" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!resume && !hasCertificates && (
          <div className="rounded-lg border border-dashed border-border bg-surface-soft p-4 text-center">
            <p className="text-sm text-ink-muted">No credentials uploaded yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function StatusSection({ approved, createdAt, updatedAt }) {
  const StatusIcon = approved ? CheckCircle2 : Clock;
  const statusTitle = approved ? "Profile Approved" : "Verification in Progress";
  const statusDescription = approved
    ? "Your instructor profile has been approved. You can now publish courses and accept enrollments."
    : "Your profile is under review. This usually takes 24–48 hours. You'll be notified once approved.";

  return (
    <section className="mt-6 card p-5 sm:p-6" aria-labelledby="status-heading">
      <div className="flex items-center gap-2">
        <StatusIcon
          size={18}
          className={approved ? "text-green-500" : "text-amber-500"}
          aria-hidden="true"
        />
        <h2 id="status-heading" className="section-title">
          Application Status
        </h2>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface-soft p-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              approved ? "bg-green-50" : "bg-amber-50"
            }`}
          >
            <StatusIcon
              size={20}
              className={approved ? "text-green-600" : "text-amber-600"}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold ${
                approved ? "text-green-700" : "text-amber-700"
              }`}
            >
              {statusTitle}
            </p>
            <p className="mt-1 text-sm text-ink-muted">{statusDescription}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-ink-muted">Profile Created</p>
          <p className="mt-0.5 text-sm font-medium text-ink">
            {createdAt
              ? new Date(createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-ink-muted">Last Updated</p>
          <p className="mt-0.5 text-sm font-medium text-ink">
            {updatedAt
              ? new Date(updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProfileView({ profile, onEdit }) {
  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14"
    >
      <ProfileHeader profile={profile} onEdit={onEdit} />
      <AboutSection about={profile.about} />
      <CredentialsSection
        resume={profile.resume}
        certificates={profile.certificates}
      />
      <StatusSection
        approved={profile.approved}
        createdAt={profile.createdAt}
        updatedAt={profile.updatedAt}
      />
    </Motion.div>
  );
}

export default function TutorProfilePage() {
  const [mode, setMode] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const existing = await fetchMyTutorProfile();
        if (isMounted) {
          if (existing) {
            setProfileData(existing);
            setMode("view");
          } else {
            setMode("edit");
          }
        }
      } catch {
        if (isMounted) {
          setMode("edit");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleEdit() {
    setMode("edit");
  }

  function handleCancel() {
    if (profileData) {
      setMode("view");
    }
  }

  function handleSuccess(newProfile) {
    setProfileData(newProfile);
    setMode("view");
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (mode === "view" && profileData) {
    return <ProfileView profile={profileData} onEdit={handleEdit} />;
  }

  return (
    <TutorProfileForm
      initialProfile={profileData}
      onSuccess={handleSuccess}
      onCancel={profileData ? handleCancel : null}
    />
  );
}
