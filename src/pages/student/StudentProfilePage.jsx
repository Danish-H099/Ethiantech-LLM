import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { m as Motion } from "motion/react";
import {
  Award,
  Camera,
  Download,
  FileText,
  Globe,
  Pencil,
  RotateCcw,
  Save,
  Settings,
  Share2,
  Trophy,
  User,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

import {
  getStudentProfile,
  updateStudentProfile,
  updatePreferences,
  resetPreferences,
  getStudentCertificates,
} from "src/services/studentRepository";
import { formatRelativeTime } from "src/lib/format";
import { avatarFallback } from "src/lib/assets";
import {
  UnderlineTabList,
  UnderlineTab,
} from "src/components/student/UnderlineTabList";
import StudentEmptyState from "src/components/student/StudentEmptyState";
import { fadeIn } from "src/lib/animationVariants";

const PROFILE_TABS = [
  { value: "account", label: "Account", icon: User },
  { value: "certificates", label: "Certificates", icon: Award },
  { value: "preferences", label: "Preferences", icon: Settings },
];

const TIMEZONE_OPTIONS = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const MOTION_OPTIONS = [
  { value: "auto", label: "System Default" },
  { value: "reduced", label: "Reduced Motion" },
  { value: "standard", label: "Standard" },
];

// ---------------------------------------------------------------- sections

function ProfileHeader({ profile, onAvatarChange, onEditProfile }) {
  const socialLinks = [
    {
      label: "LinkedIn",
      href: profile.socialLinks?.linkedin,
      icon: "linkedin",
    },
    {
      label: "GitHub",
      href: profile.socialLinks?.github,
      icon: "github",
    },
    {
      label: "Website",
      href: profile.socialLinks?.website,
      icon: "website",
    },
  ].filter((link) => link.href);

  return (
    <section className="card overflow-hidden">
      <div className="bg-tint-student px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="group relative shrink-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-brand/10 shadow-avatar">
              <img
                src={profile.avatar}
                alt={`${profile.fullName} avatar`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={avatarFallback}
              />
            </div>
            <button
              type="button"
              onClick={onAvatarChange}
              aria-label="Change avatar"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-student"
            >
              <Camera size={22} aria-hidden="true" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="page-title mt-2">{profile.fullName}</h1>
            <p className="mt-1 text-sm-fluid text-ink-muted">{profile.email}</p>
            <p className="mt-0.5 text-sm-fluid text-ink-muted">
              Member since{" "}
              {new Date(profile.joinedAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2" aria-label="Social links">
                {socialLinks.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${label} profile (opens in a new tab)`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-ink transition hover:border-accent-student hover:text-accent-student focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-student"
                  >
                    {icon === "linkedin" ? (
                      <FaLinkedinIn size={17} aria-hidden="true" />
                    ) : icon === "github" ? (
                      <FaGithub size={17} aria-hidden="true" />
                    ) : (
                      <Globe size={17} aria-hidden="true" />
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onEditProfile}
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

function AboutSection({ bio }) {
  return (
    <section className="mt-6 card p-5 sm:p-6" aria-labelledby="about-heading">
      <div className="flex items-center gap-2">
        <FileText size={18} className="text-accent-student" aria-hidden="true" />
        <h2 id="about-heading" className="section-title">About</h2>
      </div>
      <p className="mt-3 text-sm-fluid leading-relaxed text-ink-muted">
        {bio?.trim() || "Add a short bio to help instructors and fellow learners know more about you."}
      </p>
    </section>
  );
}

function AccountTab({ profile }) {
  const [form, setForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    timezone: profile.timezone,
    goal: profile.goal,
    bio: profile.bio ?? "",
    linkedin: profile.socialLinks?.linkedin ?? "",
    github: profile.socialLinks?.github ?? "",
    website: profile.socialLinks?.website ?? "",
  });
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSave() {
    updateStudentProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      timezone: form.timezone,
      goal: form.goal,
      bio: form.bio,
      socialLinks: {
        linkedin: form.linkedin,
        github: form.github,
        website: form.website,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mt-6"
    >
      <div className="card p-5 sm:p-6">
        <h2 className="mb-5 text-body-lg font-semibold text-ink">Personal Information</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="label">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="label">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="timezone" className="label">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="input"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="goal" className="label">Learning Goal</label>
          <textarea
            id="goal"
            name="goal"
            value={form.goal}
            onChange={handleChange}
            rows={2}
            placeholder="e.g. Complete the Full-Stack Web Development track by December"
            className="input resize-none"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="bio" className="label">About</label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Tell learners a little about yourself..."
            className="input resize-none"
          />
        </div>

        <h3 className="mt-8 mb-4 text-body-lg font-semibold text-ink">Social Links</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="linkedin" className="label">
              <FaLinkedinIn size={14} className="inline-block" aria-hidden="true" /> LinkedIn
            </label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="github" className="label">
              <FaGithub size={14} className="inline-block" aria-hidden="true" /> GitHub
            </label>
            <input
              id="github"
              name="github"
              type="url"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="website" className="label">
              <Globe size={14} className="inline-block" aria-hidden="true" /> Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="input"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="btn-brand px-5 py-2.5 text-sm-fluid"
          >
            <Save size={16} aria-hidden="true" />
            Save Changes
          </button>
          {saved && (
            <span className="text-sm-fluid font-medium text-success">Saved!</span>
          )}
        </div>
      </div>
    </Motion.div>
  );
}

function CertificateCard({ cert }) {
  function handleShare(platform) {
    toast.success(`${platform} share ready`, {
      description: "Mock share action — no external post was created.",
    });
  }

  return (
    <div className="card overflow-hidden">
      {cert.courseImage && (
        <div className="relative h-[140px] overflow-hidden bg-surface">
          <img
            src={cert.courseImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-medium text-success">
              <Trophy size={12} aria-hidden="true" />
              Certificate
            </span>
          </div>
        </div>
      )}
      <div className="p-4">
        <Link
          to={`/student/course/${cert.courseId}`}
          className="block truncate text-sm-fluid font-semibold text-ink transition hover:text-accent-student"
        >
          {cert.courseTitle}
        </Link>
        {cert.institutionName && (
          <p className="mt-0.5 truncate text-sm-fluid text-ink-muted">
            {cert.institutionName}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-sm-fluid">
          {cert.grade && (
            <span className="font-semibold text-ink">{cert.grade}</span>
          )}
          {cert.score != null && (
            <span className="text-ink-muted">{cert.score}%</span>
          )}
          {cert.completedAt && (
            <span className="ml-auto text-ink-muted">
              {formatRelativeTime(cert.completedAt)}
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
            <Share2 size={13} aria-hidden="true" />
            Share achievement
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-outline w-full py-2 text-sm-fluid"
          >
            <Download size={14} aria-hidden="true" />
            Download Certificate
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleShare("LinkedIn")}
              aria-label="Share certificate on LinkedIn (mock action)"
              className="btn-outline flex items-center justify-center gap-2 py-2 text-sm-fluid"
            >
              <FaLinkedinIn size={15} aria-hidden="true" />
              LinkedIn
            </button>
            <button
              type="button"
              onClick={() => handleShare("X")}
              aria-label="Share certificate on X (mock action)"
              className="btn-outline flex items-center justify-center gap-2 py-2 text-sm-fluid"
            >
              <FaXTwitter size={15} aria-hidden="true" />
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificatesTab() {
  const certificates = useMemo(() => getStudentCertificates(), []);

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mt-6"
    >
      {certificates.length === 0 ? (
        <div className="card px-4 py-14">
          <StudentEmptyState
            icon={Award}
            title="No certificates yet"
            description="Complete a course to earn your first certificate."
            action={{ label: "Browse Courses", to: "/courses" }}
          />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <CertificateCard key={cert.courseId} cert={cert} />
          ))}
        </div>
      )}
    </Motion.div>
  );
}

function PreferencesTab({ profile }) {
  const prefs = profile.preferences ?? {};
  const [localPrefs, setLocalPrefs] = useState({
    fontSize: prefs.fontSize ?? 100,
    reducedMotion: prefs.reducedMotion ?? "auto",
    announcements: prefs.emailNotifications?.announcements ?? true,
    deadlines: prefs.emailNotifications?.deadlines ?? true,
    completions: prefs.emailNotifications?.completions ?? true,
  });
  const [saved, setSaved] = useState(false);

  function handlePrefChange(key, value) {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    updatePreferences({
      fontSize: localPrefs.fontSize,
      reducedMotion: localPrefs.reducedMotion,
      emailNotifications: {
        announcements: localPrefs.announcements,
        deadlines: localPrefs.deadlines,
        completions: localPrefs.completions,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    const reset = resetPreferences();
    setLocalPrefs({
      fontSize: reset.preferences.fontSize,
      reducedMotion: reset.preferences.reducedMotion,
      announcements: reset.preferences.emailNotifications.announcements,
      deadlines: reset.preferences.emailNotifications.deadlines,
      completions: reset.preferences.emailNotifications.completions,
    });
    setSaved(false);
  }

  return (
    <Motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mt-6 space-y-6"
    >
      {/* Appearance */}
      <div className="card p-5 sm:p-6">
        <h2 className="mb-5 text-body-lg font-semibold text-ink">Appearance</h2>

        <div className="mb-5">
          <label htmlFor="fontSize" className="label">Font Size ({localPrefs.fontSize}%)</label>
          <input
            id="fontSize"
            type="range"
            min={60}
            max={200}
            step={10}
            value={localPrefs.fontSize}
            onChange={(e) => handlePrefChange("fontSize", Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-muted">
            <span>60%</span>
            <span>130%</span>
            <span>200%</span>
          </div>
        </div>

        <div>
          <p id="motion-label" className="label">Motion</p>
          <div role="group" aria-labelledby="motion-label" className="flex flex-wrap gap-3">
            {MOTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handlePrefChange("reducedMotion", opt.value)}
                className={`rounded-lg border px-4 py-2 text-sm-fluid transition ${
                  localPrefs.reducedMotion === opt.value
                    ? "border-brand bg-tint-student font-medium text-brand-strong"
                    : "border-border text-ink-muted hover:border-brand hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="card p-5 sm:p-6">
        <h2 className="mb-5 text-body-lg font-semibold text-ink">Email Notifications</h2>
        <div className="space-y-4">
          {[
            { key: "announcements", label: "Course announcements", desc: "New materials, live Q&As, and instructor updates" },
            { key: "deadlines", label: "Upcoming deadlines", desc: "Reminders before tasks are due" },
            { key: "completions", label: "Course completions", desc: "Celebrate when you finish a course" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 transition hover:bg-surface-soft"
            >
              <div>
                <p className="text-sm-fluid font-medium text-ink">{item.label}</p>
                <p className="text-sm-fluid text-ink-muted">{item.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={localPrefs[item.key]}
                aria-label={item.label}
                onClick={() => handlePrefChange(item.key, !localPrefs[item.key])}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                  localPrefs[item.key] ? "bg-brand" : "bg-toggle"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    localPrefs[item.key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="btn-brand px-5 py-2.5 text-sm-fluid"
        >
          <Save size={16} aria-hidden="true" />
          Save Preferences
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="btn-outline px-4 py-2 text-sm-fluid"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Reset to Defaults
        </button>
        {saved && (
          <span className="text-sm-fluid font-medium text-success">Saved!</span>
        )}
      </div>
    </Motion.div>
  );
}

// ------------------------------------------------------------------- page

export default function StudentProfilePage() {
  const [revision, setRevision] = useState(0);
  // `revision` forces a fresh read from the repository after each mutation.
  const profile = useMemo(() => {
    void revision;
    return getStudentProfile();
  }, [revision]);
  const [activeTab, setActiveTab] = useState("account");

  function handleAvatarChange() {
    // Cycle through randomuser.me portrait IDs as a simple avatar change demo
    const current = profile.avatar;
    const match = current?.match(/\/portraits\/men\/(\d+)\./);
    const nextId = match ? (Number(match[1]) % 70) + 1 : 1;
    const newAvatar = `https://randomuser.me/api/portraits/men/${nextId}.jpg`;
    updateStudentProfile({ avatar: newAvatar });
    setRevision((v) => v + 1);
  }

  return (
    <div>
      <ProfileHeader
        profile={profile}
        onAvatarChange={handleAvatarChange}
        onEditProfile={() => setActiveTab("account")}
      />
      <AboutSection bio={profile.bio} />

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <UnderlineTabList ariaLabel="Profile sections">
          {PROFILE_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <UnderlineTab key={tab.value} value={tab.value}>
                <Icon size={16} aria-hidden="true" />
                {tab.label}
              </UnderlineTab>
            );
          })}
        </UnderlineTabList>

        <Tabs.Content value="account">
          <AccountTab profile={profile} />
        </Tabs.Content>

        <Tabs.Content value="certificates">
          <CertificatesTab />
        </Tabs.Content>

        <Tabs.Content value="preferences">
          <PreferencesTab profile={profile} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
