import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Save,
  X,
  Check,
  Image,
  FileText,
  Briefcase,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { uploadTutorProfile } from "src/services/tutorProfile";
import { submitTutorOnboarding } from "src/services/stores/tutorOnboarding";

export default function TutorProfileForm({ initialProfile, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    fullName: initialProfile?.fullName || "",
    headline: initialProfile?.headline || "",
    about: initialProfile?.about || "",
    age: initialProfile?.age ? String(initialProfile.age) : "",
    gender: initialProfile?.gender || "",
    photoName: "",
    photoPreview: initialProfile?.profileImage
      ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${initialProfile.profileImage}`
      : null,
    resumeName: initialProfile?.resume ? "Current resume" : "",
    nationality: initialProfile?.nationality || "",
    certName: initialProfile?.certificates?.[0]?.fileName || "",
    agreePolicy: false,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [certFiles, setCertFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const photoRef = useRef(null);
  const resumeRef = useRef(null);
  const certRef = useRef(null);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => {
      const n = { ...p };
      delete n[k];
      return n;
    });
    setApiError("");
  }

  function handlePhoto(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, photo: "Image must be under 5MB." }));
      return;
    }
    setPhotoFile(file);
    setField("photoName", file.name);
    const r = new FileReader();
    r.onload = (e) => setField("photoPreview", e.target.result);
    r.readAsDataURL(file);
  }

  function handleResume(file) {
    if (file) {
      setResumeFile(file);
      setField("resumeName", file.name);
    }
  }

  function handleCert(file) {
    if (file) {
      setCertFiles([file]);
      setField("certName", file.name);
    }
  }

  function wordCount(t) {
    return t.trim() ? t.trim().split(/\s+/).length : 0;
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    const hw = wordCount(form.headline);
    if (!form.headline.trim()) e.headline = "Headline is required.";
    else if (hw > 5) e.headline = `Headline must be 5 words or less (${hw} words).`;
    const aw = wordCount(form.about);
    if (!form.about.trim()) e.about = "About you is required.";
    else if (aw > 80) e.about = `About must be 80 words or less (${aw} words).`;
    if (!form.age.trim()) e.age = "Age is required.";
    else if (Number(form.age) < 18 || Number(form.age) > 120) e.age = "Invalid age.";
    if (!form.gender) e.gender = "Gender is required.";
    if (!photoFile && !form.photoPreview) e.photo = "Profile image is required.";
    if (!resumeFile && !form.resumeName) e.resume = "Resume is required.";
    if (!form.nationality.trim()) e.nationality = "Nationality is required.";
    if (!form.agreePolicy) e.agreePolicy = "You must agree to the policy.";
    return e;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    try {
      setIsSubmitting(true);
      const res = await uploadTutorProfile({
        fullName: form.fullName,
        headline: form.headline,
        about: form.about,
        age: Number(form.age),
        gender: form.gender,
        nationality: form.nationality,
        profileImage: photoFile,
        resume: resumeFile,
        certificates: certFiles,
      });

      submitTutorOnboarding({
        profile: {
          fullName: form.fullName,
          headline: form.headline,
          about: form.about,
          age: form.age,
          gender: form.gender,
          nationality: form.nationality,
          profileImage: res.profile?.profileImage,
        },
      });

      setSaved(true);
      toast.success("Tutor profile saved and submitted successfully!");
      
      if (onSuccess) {
        onSuccess(res.profile);
      }
    } catch (err) {
      console.error("Profile save error:", err);
      setApiError(err.message || "Unable to save tutor profile. Please try again.");
      toast.error(err.message || "Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
    { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <div className="mb-8">
        <h1 className="page-title">
          {initialProfile ? "Edit Tutor Profile" : "Tutor Profile"}
        </h1>
        <p className="mt-2 text-subtitle text-ink-muted">
          Keep your public profile sharp. Only these fields are shown to students.
        </p>
      </div>

      {apiError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-error/40 bg-error-soft p-4 text-error">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm-fluid font-medium">{apiError}</p>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <section className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="label">
                Tutor&apos;s Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                placeholder="e.g. Amina Bekele"
                className={`input ${errors.fullName ? "border-error" : ""}`}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-sm-fluid text-error">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label htmlFor="headline" className="label">
                Headline{" "}
                <span className="text-ink-muted font-normal">(max 5 words)</span>
              </label>
              <input
                id="headline"
                type="text"
                value={form.headline}
                onChange={(e) => setField("headline", e.target.value)}
                placeholder="e.g. Senior Cloud Architect"
                className={`input ${errors.headline ? "border-error" : ""}`}
              />
              <div className="mt-1.5 flex items-center justify-between gap-2">
                {errors.headline ? (
                  <p className="text-sm-fluid text-error">{errors.headline}</p>
                ) : (
                  <span
                    className={`text-xs font-medium ${wordCount(form.headline) > 5 ? "text-error" : "text-ink-muted"
                      }`}
                  >
                    {wordCount(form.headline)} / 5 words
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="about" className="label">
              About You{" "}
              <span className="text-ink-muted font-normal">(max 80 words)</span>
            </label>
            <textarea
              id="about"
              rows={4}
              value={form.about}
              onChange={(e) => setField("about", e.target.value)}
              placeholder="What do you teach, and what practical experience do you bring to it?"
              className={`input resize-none py-2.5 ${errors.about ? "border-error" : ""}`}
            />
            <div className="mt-1.5 flex items-center justify-between gap-2">
              {errors.about ? (
                <p className="text-sm-fluid text-error">{errors.about}</p>
              ) : (
                <span
                  className={`text-xs font-medium ${wordCount(form.about) > 80 ? "text-error" : "text-ink-muted"
                    }`}
                >
                  {wordCount(form.about)} / 80 words
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="age" className="label">
              Age
            </label>
            <input
              id="age"
              type="number"
              min={18}
              max={120}
              value={form.age}
              onChange={(e) => setField("age", e.target.value)}
              placeholder="e.g. 28"
              className={`input ${errors.age ? "border-error" : ""}`}
            />
            {errors.age && (
              <p className="mt-1.5 text-sm-fluid text-error">{errors.age}</p>
            )}
          </div>
          <div>
            <label htmlFor="gender" className="label">
              Gender
            </label>
            <select
              id="gender"
              value={form.gender}
              onChange={(e) => setField("gender", e.target.value)}
              className={`input ${errors.gender ? "border-error" : ""}`}
            >
              <option value="">Select gender</option>
              {genderOptions.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="mt-1.5 text-sm-fluid text-error">{errors.gender}</p>
            )}
          </div>
          <div>
            <label htmlFor="nationality" className="label">
              Nationality
            </label>
            <input
              id="nationality"
              type="text"
              value={form.nationality}
              onChange={(e) => setField("nationality", e.target.value)}
              placeholder="e.g. Ethiopian"
              className={`input ${errors.nationality ? "border-error" : ""}`}
            />
            {errors.nationality && (
              <p className="mt-1.5 text-sm-fluid text-error font-medium">
                {errors.nationality}
              </p>
            )}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="label mb-0">
              Profile Image{" "}
              <span className="text-ink-muted font-normal">(max 5MB)</span>
            </h3>
            <div className="mt-2">
              {form.photoPreview ? (
                <div className="flex items-center gap-4 rounded-xl border border-border bg-white px-4 py-4 shadow-sm">
                  <img
                    src={form.photoPreview}
                    alt="Preview"
                    className="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-brand/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {form.photoName}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setField("photoName", "");
                        setField("photoPreview", null);
                      }}
                      className="mt-2 inline-flex items-center gap-1 rounded-full bg-error-soft text-error hover:bg-error/10 px-2.5 py-0.5 text-xs font-semibold transition"
                    >
                      <X size={12} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className={`group flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-6 text-center transition ${errors.photo
                    ? "border-error bg-error-soft/20"
                    : "border-border bg-surface-soft hover:border-brand hover:bg-tint-tutor hover:shadow-md"
                    }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border group-hover:ring-brand/30 transition">
                    <Image size={20} className="text-brand" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Click to upload photo
                    </p>
                    <p className="text-xs text-ink-muted">JPG or PNG — up to 5MB</p>
                  </div>
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handlePhoto(f);
                      e.target.value = "";
                    }}
                  />
                </button>
              )}
            </div>
            {errors.photo && (
              <p className="mt-2 text-sm-fluid text-error font-medium">
                {errors.photo}
              </p>
            )}
          </div>

          <div>
            <h3 className="label mb-0">Resume</h3>
            <div className="mt-2">
              {form.resumeName ? (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                  <FileText size={16} className="text-brand shrink-0" />
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                    {form.resumeName}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeFile(null);
                      setField("resumeName", "");
                    }}
                    aria-label="Remove resume"
                    className="shrink-0 rounded-full p-1 text-ink-muted hover:text-error hover:bg-error-soft transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => resumeRef.current?.click()}
                  className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 text-center transition ${errors.resume
                    ? "border-error bg-error-soft/20"
                    : "border-border bg-surface-soft hover:border-brand hover:bg-tint-tutor hover:shadow-md"
                    }`}
                >
                  <Briefcase size={18} className="text-brand" />
                  <span className="text-sm font-medium text-ink">Upload resume</span>
                  <span className="text-xs text-ink-muted">PDF / DOCX</span>
                  <input
                    ref={resumeRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleResume(f);
                      e.target.value = "";
                    }}
                  />
                </button>
              )}
            </div>
            {errors.resume && (
              <p className="mt-2 text-sm-fluid text-error font-medium">
                {errors.resume}
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="label mb-0">
            Certificate / Licenses{" "}
            <span className="text-ink-muted font-normal">(optional)</span>
          </h3>
          <div className="mt-2">
            {form.certName ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                <Award size={16} className="text-brand-secondary-strong shrink-0" />
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                  {form.certName}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCertFiles([]);
                    setField("certName", "");
                  }}
                  aria-label="Remove certificate"
                  className="shrink-0 rounded-full p-1 text-ink-muted hover:text-error hover:bg-error-soft transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => certRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-soft px-6 py-6 text-center transition hover:border-brand hover:bg-tint-tutor hover:shadow-md"
              >
                <Award size={20} className="text-brand-secondary-strong" />
                <span className="text-sm font-medium text-ink">
                  Upload certificate
                </span>
                <span className="text-xs text-ink-muted">
                  Optional — PDF / DOCX / JPG / PNG
                </span>
                <input
                  ref={certRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCert(f);
                    e.target.value = "";
                  }}
                />
              </button>
            )}
          </div>
        </section>

        <section>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.agreePolicy}
              onChange={(e) => setField("agreePolicy", e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-border text-brand focus:ring-brand accent-brand"
            />
            <span className="text-sm-fluid text-ink leading-relaxed">
              I agree to the{" "}
              <a
                href="/policy"
                className="font-semibold text-brand-secondary-strong hover:text-brand underline underline-offset-2 transition"
              >
                Policy
              </a>{" "}
              and confirm all information is accurate.
            </span>
          </label>
          {errors.agreePolicy && (
            <p className="mt-2 text-sm-fluid text-error font-medium">
              {errors.agreePolicy}
            </p>
          )}
        </section>

        <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
          <div className="min-h-[36px]">
            {saved && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm-fluid font-medium text-success shadow-sm">
                <Check size={14} /> Saved &amp; Submitted
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-outline rounded-lg px-6 py-2.5 text-sm-fluid"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-brand rounded-lg px-6 py-2.5 text-sm-fluid shadow-sm hover:shadow-md hover:-translate-y-px transition active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Uploading Profile...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
